const Trip = require('../models/trip.model');
const Booking = require('../models/booking.model');
const SeatAllocation = require('../models/seatAllocation.model');

const getOperatorTrips = async (operatorId, role) => {
  const query = {};
  if (role !== 'admin') {
    query.operator = operatorId;
  }

  return Trip.find(query)
    .populate('bus', 'busNumber name type totalSeats')
    .populate({
      path: 'route',
      populate: [
        { path: 'source', select: 'name city state' },
        { path: 'destination', select: 'name city state' }
      ]
    })
    .sort({ travelDate: 1, departureTime: 1 });
};

const getTripManifest = async (tripId, operatorId, role) => {
  const trip = await Trip.findById(tripId)
    .populate('bus', 'busNumber name type totalSeats seatLayout')
    .populate({
      path: 'route',
      populate: [
        { path: 'source', select: 'name city state' },
        { path: 'destination', select: 'name city state' },
        { path: 'stops.stop', select: 'name city state' }
      ]
    })
    .populate('operator', 'name email phone');

  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }

  if (role !== 'admin' && trip.operator && trip.operator._id.toString() !== operatorId.toString()) {
    const error = new Error('Access denied. You can only view the manifest for trips assigned to you.');
    error.statusCode = 403;
    throw error;
  }

  // Find all confirmed bookings for this trip
  const bookings = await Booking.find({
    trip: tripId,
    status: 'confirmed'
  })
    .populate('user', 'name email phone')
    .populate('boardingPoint', 'name city state')
    .populate('droppingPoint', 'name city state');

  // Extract passenger manifest
  const manifest = [];
  bookings.forEach((booking) => {
    booking.passengers.forEach((passenger) => {
      manifest.push({
        bookingId: booking._id,
        pnr: booking.pnr,
        passengerName: passenger.name,
        age: passenger.age,
        gender: passenger.gender,
        seatNumber: passenger.seatNumber,
        fare: passenger.fare,
        primaryContactName: booking.user ? booking.user.name : '',
        primaryContactPhone: booking.user ? booking.user.phone : '',
        primaryContactEmail: booking.user ? booking.user.email : '',
        boardingPoint: booking.boardingPoint ? booking.boardingPoint.name : '',
        droppingPoint: booking.droppingPoint ? booking.droppingPoint.name : '',
        bookingStatus: booking.status,
        bookedAt: booking.bookedAt
      });
    });
  });

  // Sort manifest by seatNumber
  manifest.sort((a, b) => a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true }));

  return {
    trip: {
      _id: trip._id,
      travelDate: trip.travelDate,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      status: trip.status,
      bus: trip.bus,
      route: trip.route,
      operator: trip.operator
    },
    totalPassengers: manifest.length,
    manifest
  };
};

module.exports = {
  getOperatorTrips,
  getTripManifest
};
