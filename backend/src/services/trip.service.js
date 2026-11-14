const Trip = require('../models/trip.model');
const Bus = require('../models/bus.model');
const Route = require('../models/route.model');
const Stop = require('../models/stop.model');
const User = require('../models/user.model');
const SeatAllocation = require('../models/seatAllocation.model');
const mongoose = require('mongoose');

const {
  CITY_COORDINATES,
  calculateDistance,
  formatMinutes,
  calculateArrivalTime,
  normalizeCity,
} = require('../utils/distance');

const {
  VERIFIED_OPERATORS,
  calculateDynamicFare,
  generateSeatLayout,
  generateBusNumber,
} = require('../utils/providers');

/**
 * Ensures realistic scheduled trips exist for a given route and date.
 * Automatically provisions Stops, Route, Bus fleet, and scheduled departures in MongoDB.
 */
const ensureTripsForRoute = async (sourceCity, destCity, travelDate) => {
  const normSource = normalizeCity(sourceCity);
  const normDest = normalizeCity(destCity);

  if (!normSource || !normDest || normSource === normDest) {
    return [];
  }

  // Only auto-provision for recognized geographic cities or known corridors
  const isSourceKnown = !!CITY_COORDINATES[normSource];
  const isDestKnown = !!CITY_COORDINATES[normDest];

  if (!isSourceKnown && !isDestKnown) {
    return [];
  }

  const { distanceKm, durationMinutes, durationFormatted } = calculateDistance(sourceCity, destCity);

  // 1. Ensure Stops in MongoDB
  let sourceStop = await Stop.findOne({
    $or: [
      { city: new RegExp(`^${normSource}$`, 'i') },
      { name: new RegExp(normSource, 'i') },
    ],
  });

  if (!sourceStop) {
    const state = CITY_COORDINATES[normSource]?.state || 'India';
    sourceStop = await Stop.create({
      name: `${capitalize(normSource)} Central Bus Terminal`,
      city: capitalize(normSource),
      state,
    });
  }

  let destStop = await Stop.findOne({
    $or: [
      { city: new RegExp(`^${normDest}$`, 'i') },
      { name: new RegExp(normDest, 'i') },
    ],
  });

  if (!destStop) {
    const state = CITY_COORDINATES[normDest]?.state || 'India';
    destStop = await Stop.create({
      name: `${capitalize(normDest)} Intercity Bus Stand`,
      city: capitalize(normDest),
      state,
    });
  }

  // 2. Ensure Route in MongoDB
  let route = await Route.findOne({
    source: sourceStop._id,
    destination: destStop._id,
  });

  if (!route) {
    route = await Route.create({
      name: `${sourceStop.city} ➔ ${destStop.city} Express Corridor`,
      source: sourceStop._id,
      destination: destStop._id,
      totalDistance: distanceKm,
      estimatedDuration: durationMinutes,
      stops: [],
    });
  } else if (!route.totalDistance || route.totalDistance === 0) {
    route.totalDistance = distanceKm;
    route.estimatedDuration = durationMinutes;
    await route.save();
  }

  // 3. Normalize Date range
  const targetDate = travelDate ? new Date(travelDate) : new Date();
  if (isNaN(targetDate.getTime())) targetDate.setTime(Date.now());
  targetDate.setUTCHours(0, 0, 0, 0);

  const startOfDay = new Date(targetDate);
  const endOfDay = new Date(targetDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  // Check how many scheduled trips currently exist for this route on this day
  const existingTrips = await Trip.find({
    route: route._id,
    travelDate: { $gte: startOfDay, $lte: endOfDay },
    status: 'scheduled',
  });

  if (existingTrips.length >= 3) {
    return existingTrips;
  }

  // 4. Ensure demo operator user in MongoDB
  let operatorUser = await User.findOne({ role: 'operator' });
  if (!operatorUser) {
    operatorUser = await User.findOne({ role: 'admin' });
  }

  // 5. Generate 4 to 6 distinct departures spread across the day
  const selectedOperators = VERIFIED_OPERATORS.slice(0, 5);
  const newTrips = [];

  for (let i = 0; i < selectedOperators.length; i++) {
    const op = selectedOperators[i];
    const departureTime = op.departureSlots[i % op.departureSlots.length];
    const arrivalTime = calculateArrivalTime(departureTime, durationMinutes);
    const fare = calculateDynamicFare(distanceKm, op);

    // Create / find Bus for this operator
    const stateCode = (sourceStop.state || 'MH').slice(0, 2).toUpperCase();
    const busNumber = generateBusNumber(stateCode, i + Math.floor(distanceKm % 100));

    let bus = await Bus.findOne({ busNumber });
    if (!bus) {
      const layoutData = generateSeatLayout(op.totalSeats, op.isSleeper);
      bus = await Bus.create({
        busNumber,
        name: op.busName,
        type: op.busType,
        totalSeats: op.totalSeats,
        seatLayout: layoutData,
        operator: operatorUser ? operatorUser._id : undefined,
        amenities: op.amenities,
        isActive: true,
      });
    }

    // Create Trip document
    const trip = await Trip.create({
      bus: bus._id,
      route: route._id,
      operator: operatorUser ? operatorUser._id : undefined,
      travelDate: targetDate,
      departureTime,
      arrivalTime,
      fare,
      boardingPoints: [{ stop: sourceStop._id, time: departureTime }],
      droppingPoints: [{ stop: destStop._id, time: arrivalTime }],
      status: 'scheduled',
      availableSeats: Math.max(12, op.totalSeats - ((i * 7 + 5) % 18)),
    });

    newTrips.push(trip);
  }

  return newTrips;
};

/**
 * Searches trips matching source, destination, and travel date
 */
const searchTrips = async ({ source, destination, date }) => {
  const query = { status: 'scheduled' };

  // Date filtering
  let targetTravelDate = null;
  if (date) {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      targetTravelDate = parsedDate;
      const startOfDay = new Date(parsedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(parsedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      query.travelDate = { $gte: startOfDay, $lte: endOfDay };
    }
  }

  // Handle source & destination lookup
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
            { city: { $regex: source.trim(), $options: 'i' } },
          ],
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
            { city: { $regex: destination.trim(), $options: 'i' } },
          ],
        }).select('_id');
        destStopIds = destStops.map((s) => s._id);
      }
    }

    const routeQuery = {};
    if (source && sourceStopIds.length > 0) {
      routeQuery.$or = [
        { source: { $in: sourceStopIds } },
        { 'stops.stop': { $in: sourceStopIds } },
      ];
    } else if (source && sourceStopIds.length === 0) {
      // If source not found in existing stops, attempt dynamic provisioning
      if (source && destination) {
        await ensureTripsForRoute(source, destination, targetTravelDate || new Date());
        return searchTrips({ source, destination, date });
      }
      return [];
    }

    if (destination && destStopIds.length > 0) {
      const destCondition = [
        { destination: { $in: destStopIds } },
        { 'stops.stop': { $in: destStopIds } },
      ];
      if (routeQuery.$or) {
        routeQuery.$and = [{ $or: routeQuery.$or }, { $or: destCondition }];
        delete routeQuery.$or;
      } else {
        routeQuery.$or = destCondition;
      }
    } else if (destination && destStopIds.length === 0) {
      // If destination not found in existing stops, attempt dynamic provisioning
      if (source && destination) {
        await ensureTripsForRoute(source, destination, targetTravelDate || new Date());
        return searchTrips({ source, destination, date });
      }
      return [];
    }

    let routes = await Route.find(routeQuery).select('_id');
    let matchedRouteIds = routes.map((r) => r._id);

    // If no existing route matched, dynamically provision realistic trips
    if (matchedRouteIds.length === 0 && source && destination) {
      await ensureTripsForRoute(source, destination, targetTravelDate || new Date());
      // Re-query route
      routes = await Route.find(routeQuery).select('_id');
      matchedRouteIds = routes.map((r) => r._id);
      if (matchedRouteIds.length === 0) {
        return [];
      }
    }

    query.route = { $in: matchedRouteIds };
  }

  // Fetch trips from database
  let trips = await Trip.find(query)
    .populate('bus', 'busNumber name type totalSeats amenities seatLayout')
    .populate({
      path: 'route',
      populate: [
        { path: 'source', select: 'name city state' },
        { path: 'destination', select: 'name city state' },
        { path: 'stops.stop', select: 'name city state' },
      ],
    })
    .populate('operator', 'name email phone')
    .populate('boardingPoints.stop', 'name city state')
    .populate('droppingPoints.stop', 'name city state')
    .sort({ travelDate: 1, departureTime: 1 });

  // If search for specific date yielded 0 trips, provision departures for that date
  if (trips.length === 0 && source && destination) {
    await ensureTripsForRoute(source, destination, targetTravelDate || new Date());
    trips = await Trip.find(query)
      .populate('bus', 'busNumber name type totalSeats amenities seatLayout')
      .populate({
        path: 'route',
        populate: [
          { path: 'source', select: 'name city state' },
          { path: 'destination', select: 'name city state' },
          { path: 'stops.stop', select: 'name city state' },
        ],
      })
      .populate('operator', 'name email phone')
      .populate('boardingPoints.stop', 'name city state')
      .populate('droppingPoints.stop', 'name city state')
      .sort({ travelDate: 1, departureTime: 1 });
  }

  // Format enriched trip objects with calculated durations, formatted fares, and ratings
  return trips.map((trip) => formatTripResponse(trip));
};

/**
 * Formats a raw Mongoose trip document into an enriched, dual-casing API response
 */
const formatTripResponse = (trip) => {
  const plain = trip.toObject ? trip.toObject() : trip;
  const route = plain.route || {};
  const bus = plain.bus || {};
  const operator = plain.operator || {};

  // Extract clean city strings to prevent React 'Objects are not valid as a React child' errors
  const sourceName =
    typeof route.source === 'object' && route.source !== null
      ? (route.source.city || route.source.name || '')
      : (route.source || '');

  const destName =
    typeof route.destination === 'object' && route.destination !== null
      ? (route.destination.city || route.destination.name || '')
      : (route.destination || '');

  const distanceKm = route.totalDistance || 250;
  const durationMinutes = route.estimatedDuration || 240;
  const durationFormatted = formatMinutes(durationMinutes);

  // Derive rating and operator branding deterministically
  const opHash = Math.abs(hash(operator.name || bus.name || 'Neeta'));
  const rating = (4.4 + (opHash % 6) * 0.1).toFixed(1);
  const ratingCount = 1200 + (opHash % 3500);

  const cleanRoute = {
    ...route,
    source: sourceName,
    destination: destName,
    sourceCity: sourceName,
    destinationCity: destName,
    sourceObj: typeof route.source === 'object' ? route.source : null,
    destinationObj: typeof route.destination === 'object' ? route.destination : null,
  };

  return {
    ...plain,
    id: plain._id,
    trip_id: plain._id,
    route: cleanRoute,
    Route: cleanRoute,
    duration: durationFormatted,
    durationMinutes,
    distance: `${distanceKm} km`,
    distanceKm,
    fare: plain.fare,
    base_fare: plain.fare,
    availableSeats: plain.availableSeats,
    available_seats: plain.availableSeats,
    departureTime: plain.departureTime,
    departure_time: plain.departureTime,
    arrivalTime: plain.arrivalTime,
    arrival_time: plain.arrivalTime,
    rating: Number(rating),
    ratingCount,
    bus_name: bus.name,
    bus_number: bus.busNumber,
    bus_type: bus.type,
    operator_name: operator.name || bus.name?.split(' ')[0] || 'BusMitra Partner',
    amenities: bus.amenities || ['AC', 'Charging Point', 'Live Tracking'],
  };
};

const getAllTrips = async (filter = {}) => {
  const query = {};
  if (filter.status) query.status = filter.status;
  if (filter.operator) query.operator = filter.operator;
  if (filter.route) query.route = filter.route;

  const trips = await Trip.find(query)
    .populate('bus', 'busNumber name type totalSeats amenities')
    .populate({
      path: 'route',
      populate: [
        { path: 'source', select: 'name city state' },
        { path: 'destination', select: 'name city state' },
      ],
    })
    .populate('operator', 'name email phone')
    .populate('boardingPoints.stop', 'name city state')
    .populate('droppingPoints.stop', 'name city state')
    .sort({ travelDate: -1, departureTime: -1 });

  return trips.map((t) => formatTripResponse(t));
};

const getTripById = async (id) => {
  const trip = await Trip.findById(id)
    .populate('bus', 'busNumber name type totalSeats seatLayout amenities')
    .populate({
      path: 'route',
      populate: [
        { path: 'source', select: 'name city state' },
        { path: 'destination', select: 'name city state' },
        { path: 'stops.stop', select: 'name city state' },
      ],
    })
    .populate('operator', 'name email phone')
    .populate('boardingPoints.stop', 'name city state')
    .populate('droppingPoints.stop', 'name city state');

  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }
  return formatTripResponse(trip);
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
    status: 'confirmed',
  });

  const bookedSeatsMap = new Map();
  allocations.forEach((alloc) => {
    bookedSeatsMap.set(alloc.seatNumber, {
      passengerName: alloc.passengerName,
      bookingId: alloc.booking,
    });
  });

  const busLayout = trip.bus.seatLayout || generateSeatLayout(trip.bus.totalSeats || 36, true);
  const layoutWithStatus = (busLayout.layout || []).map((row) => {
    return row.map((seat) => {
      const isBooked = bookedSeatsMap.has(seat.seatNumber);
      return {
        seatNumber: seat.seatNumber,
        seat_number: seat.seatNumber,
        type: seat.type,
        deck: seat.deck,
        isBooked,
        is_booked: isBooked,
        bookedDetails: isBooked ? bookedSeatsMap.get(seat.seatNumber) : null,
      };
    });
  });

  // Flat list of seats for simple iteration
  const flatSeats = [];
  layoutWithStatus.forEach((row) => {
    row.forEach((seat) => flatSeats.push(seat));
  });

  return {
    tripId: trip._id,
    busNumber: trip.bus.busNumber,
    busType: trip.bus.type,
    fare: trip.fare,
    totalSeats: trip.bus.totalSeats,
    availableSeats: trip.availableSeats,
    seatLayout: {
      ...busLayout,
      layout: layoutWithStatus,
    },
    seats: flatSeats,
  };
};

const createTrip = async (data, user = null) => {
  const { bus: busId, route: routeId, travelDate, departureTime, arrivalTime, fare } = data;

  const bus = await Bus.findById(busId);
  if (!bus) {
    const error = new Error('Bus not found');
    error.statusCode = 404;
    throw error;
  }

  // Operator check: If operator user, ensure bus belongs to operator
  if (user && user.role === 'operator' && bus.operator && bus.operator.toString() !== user._id.toString()) {
    const error = new Error('Access denied. You can only schedule trips with buses belonging to your fleet.');
    error.statusCode = 403;
    throw error;
  }

  const route = await Route.findById(routeId);
  if (!route) {
    const error = new Error('Route not found');
    error.statusCode = 404;
    throw error;
  }

  const tripData = {
    ...data,
    operator: (user && user.role === 'operator') ? user._id : (data.operator || bus.operator),
    availableSeats: bus.totalSeats,
    status: 'scheduled',
  };

  const trip = await Trip.create(tripData);
  return getTripById(trip._id);
};

const updateTrip = async (id, data, user = null) => {
  const trip = await Trip.findById(id);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }

  if (user && user.role === 'operator' && trip.operator && trip.operator.toString() !== user._id.toString()) {
    const error = new Error('Access denied. You can only update trips assigned to your fleet.');
    error.statusCode = 403;
    throw error;
  }

  const allowedUpdates = ['fare', 'departureTime', 'arrivalTime', 'status', 'boardingPoints', 'droppingPoints'];
  allowedUpdates.forEach((field) => {
    if (data[field] !== undefined) {
      trip[field] = data[field];
    }
  });

  await trip.save();
  return getTripById(trip._id);
};

const deleteTrip = async (id, user = null) => {
  const trip = await Trip.findById(id);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }

  if (user && user.role === 'operator' && trip.operator && trip.operator.toString() !== user._id.toString()) {
    const error = new Error('Access denied. You can only delete trips assigned to your fleet.');
    error.statusCode = 403;
    throw error;
  }

  const confirmedAllocations = await SeatAllocation.countDocuments({
    trip: id,
    status: 'confirmed',
  });

  if (confirmedAllocations > 0) {
    const error = new Error('Cannot delete trip with active confirmed bookings. Cancel them first.');
    error.statusCode = 400;
    throw error;
  }

  await Trip.findByIdAndDelete(id);
  return { message: 'Trip deleted successfully', id };
};

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const hash = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
};

module.exports = {
  searchTrips,
  getAllTrips,
  getTripById,
  getTripSeats,
  createTrip,
  updateTrip,
  deleteTrip,
  ensureTripsForRoute,
};
