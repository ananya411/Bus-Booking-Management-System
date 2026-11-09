const Trip = require('../models/trip.model');
const Bus = require('../models/bus.model');
const Route = require('../models/route.model');
const Stop = require('../models/stop.model');
const SeatAllocation = require('../models/seatAllocation.model');
const mongoose = require('mongoose');

const searchTrips = async ({ source, destination, date }) => {
  const query = { status: 'scheduled' };

  // If travel date is provided, filter between start and end of that day
  if (date) {
    const travelDate = new Date(date);
    if (!isNaN(travelDate.getTime())) {
      const startOfDay = new Date(travelDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(travelDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      query.travelDate = { $gte: startOfDay, $lte: endOfDay };
    }
  }

  // Handle source and destination stop matching
  let matchedRouteIds = [];
  if (source || destination) {
    let sourceStopIds = [];
    let destStopIds = [];

    if (source) {
      if (mongoose.Types.ObjectId.isValid(source)) {
        sourceStopIds.push(new mongoose.Types.ObjectId(source));
      } else {
        const sourceStops = await Stop.find({
          $or: [
            { name: { $regex: source.trim(), $options: 'i' } },
            { city: { $regex: source.trim(), $options: 'i' } }
          ]
        }).select('_id');
        sourceStopIds = sourceStops.map((s) => s._id);
      }
    }

    if (destination) {
      if (mongoose.Types.ObjectId.isValid(destination)) {
        destStopIds.push(new mongoose.Types.ObjectId(destination));
      } else {
        const destStops = await Stop.find({
          $or: [
            { name: { $regex: destination.trim(), $options: 'i' } },
            { city: { $regex: destination.trim(), $options: 'i' } }
          ]
        }).select('_id');
        destStopIds = destStops.map((s) => s._id);
      }
    }

    const routeQuery = {};
    if (source && sourceStopIds.length > 0) {
      routeQuery.$or = [
        { source: { $in: sourceStopIds } },
        { 'stops.stop': { $in: sourceStopIds } }
      ];
    } else if (source && sourceStopIds.length === 0) {
      // Source specified but no stop found
      return [];
    }

    if (destination && destStopIds.length > 0) {
      const destCondition = [
        { destination: { $in: destStopIds } },
        { 'stops.stop': { $in: destStopIds } }
      ];
      if (routeQuery.$or) {
        routeQuery.$and = [{ $or: routeQuery.$or }, { $or: destCondition }];
        delete routeQuery.$or;
      } else {
        routeQuery.$or = destCondition;
      }
    } else if (destination && destStopIds.length === 0) {
      // Destination specified but no stop found
      return [];
    }

    const routes = await Route.find(routeQuery).select('_id');
    matchedRouteIds = routes.map((r) => r._id);

    if (matchedRouteIds.length === 0) {
      return [];
    }

    query.route = { $in: matchedRouteIds };
  }

  const trips = await Trip.find(query)
    .populate('bus', 'busNumber name type totalSeats amenities seatLayout')
    .populate({
      path: 'route',
      populate: [
        { path: 'source', select: 'name city state' },
        { path: 'destination', select: 'name city state' },
        { path: 'stops.stop', select: 'name city state' }
      ]
    })
    .populate('operator', 'name email phone')
    .populate('boardingPoints.stop', 'name city state')
    .populate('droppingPoints.stop', 'name city state')
    .sort({ travelDate: 1, departureTime: 1 });

  return trips;
};

const getAllTrips = async (filter = {}) => {
  const query = {};
  if (filter.status) query.status = filter.status;
  if (filter.operator) query.operator = filter.operator;
  if (filter.route) query.route = filter.route;

  return Trip.find(query)
    .populate('bus', 'busNumber name type totalSeats amenities')
    .populate({
      path: 'route',
      populate: [
        { path: 'source', select: 'name city state' },
        { path: 'destination', select: 'name city state' }
      ]
    })
    .populate('operator', 'name email phone')
    .populate('boardingPoints.stop', 'name city state')
    .populate('droppingPoints.stop', 'name city state')
    .sort({ travelDate: -1, departureTime: -1 });
};

const getTripById = async (id) => {
  const trip = await Trip.findById(id)
    .populate('bus', 'busNumber name type totalSeats seatLayout amenities')
    .populate({
      path: 'route',
      populate: [
        { path: 'source', select: 'name city state' },
        { path: 'destination', select: 'name city state' },
        { path: 'stops.stop', select: 'name city state' }
      ]
    })
    .populate('operator', 'name email phone')
    .populate('boardingPoints.stop', 'name city state')
    .populate('droppingPoints.stop', 'name city state');

  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }
  return trip;
};

const getTripSeats = async (tripId) => {
  const trip = await Trip.findById(tripId).populate('bus');
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }

  // Find all confirmed seat allocations for this trip
  const allocations = await SeatAllocation.find({
    trip: tripId,
    status: 'confirmed'
  });

  const bookedSeatsMap = new Map();
  allocations.forEach((alloc) => {
    bookedSeatsMap.set(alloc.seatNumber, {
      passengerName: alloc.passengerName,
      bookingId: alloc.booking
    });
  });

  const busLayout = trip.bus.seatLayout;
  const layoutWithStatus = busLayout.layout.map((row) => {
    return row.map((seat) => {
      const isBooked = bookedSeatsMap.has(seat.seatNumber);
      return {
        seatNumber: seat.seatNumber,
        type: seat.type,
        deck: seat.deck,
        isBooked,
        bookedDetails: isBooked ? bookedSeatsMap.get(seat.seatNumber) : null
      };
    });
  });

  return {
    tripId: trip._id,
    busNumber: trip.bus.busNumber,
    busType: trip.bus.type,
    fare: trip.fare,
    totalSeats: trip.bus.totalSeats,
    availableSeats: trip.availableSeats,
    bookedSeatsCount: bookedSeatsMap.size,
    seatLayout: {
      rows: busLayout.rows,
      seatsPerRow: busLayout.seatsPerRow,
      layout: layoutWithStatus
    }
  };
};

const createTrip = async (tripData) => {
  const bus = await Bus.findById(tripData.bus);
  if (!bus) {
    const error = new Error('Associated Bus not found');
    error.statusCode = 404;
    throw error;
  }

  const route = await Route.findById(tripData.route);
  if (!route) {
    const error = new Error('Associated Route not found');
    error.statusCode = 404;
    throw error;
  }

  if (tripData.availableSeats === undefined) {
    tripData.availableSeats = bus.totalSeats;
  }

  if (!tripData.operator && bus.operator) {
    tripData.operator = bus.operator;
  }

  const trip = await Trip.create(tripData);

  return Trip.findById(trip._id)
    .populate('bus', 'busNumber name type totalSeats amenities seatLayout')
    .populate({
      path: 'route',
      populate: [
        { path: 'source', select: 'name city state' },
        { path: 'destination', select: 'name city state' }
      ]
    })
    .populate('operator', 'name email phone');
};

const updateTrip = async (id, tripData) => {
  const trip = await Trip.findById(id);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }

  const updatedTrip = await Trip.findByIdAndUpdate(id, tripData, {
    new: true,
    runValidators: true
  })
    .populate('bus', 'busNumber name type totalSeats amenities')
    .populate({
      path: 'route',
      populate: [
        { path: 'source', select: 'name city state' },
        { path: 'destination', select: 'name city state' }
      ]
    })
    .populate('operator', 'name email phone');

  return updatedTrip;
};

const deleteTrip = async (id) => {
  const trip = await Trip.findById(id);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if there are active confirmed allocations
  const activeBookings = await SeatAllocation.countDocuments({
    trip: id,
    status: 'confirmed'
  });

  if (activeBookings > 0) {
    const error = new Error(
      `Cannot delete trip. There are ${activeBookings} confirmed seat bookings for this trip. Cancel them or mark trip as cancelled.`
    );
    error.statusCode = 400;
    throw error;
  }

  await Trip.findByIdAndDelete(id);
  return { id };
};

module.exports = {
  searchTrips,
  getAllTrips,
  getTripById,
  getTripSeats,
  createTrip,
  updateTrip,
  deleteTrip
};
