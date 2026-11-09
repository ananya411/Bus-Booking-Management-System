const mongoose = require('mongoose');
const Booking = require('../models/booking.model');
const Trip = require('../models/trip.model');
const SeatAllocation = require('../models/seatAllocation.model');
const { generatePNR } = require('../utils/pnr');
const { logAudit } = require('../middleware/auditLogger');

/**
 * Creates a new bus booking with concurrency protection against double-booking
 */
const createBooking = async (userId, tripId, passengers, boardingPointId, droppingPointId, ip = '') => {
  if (!passengers || passengers.length === 0) {
    const error = new Error('At least one passenger is required');
    error.statusCode = 400;
    throw error;
  }

  // 1. Verify trip exists and is scheduled
  const trip = await Trip.findById(tripId).populate('bus');
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }

  if (trip.status !== 'scheduled') {
    const error = new Error(`Cannot book seats on a trip that is ${trip.status}`);
    error.statusCode = 400;
    throw error;
  }

  if (trip.availableSeats < passengers.length) {
    const error = new Error(`Only ${trip.availableSeats} seats available, but requested ${passengers.length}`);
    error.statusCode = 400;
    throw error;
  }

  const seatNumbers = passengers.map((p) => p.seatNumber.trim().toUpperCase());
  const uniqueSeatNumbers = new Set(seatNumbers);
  if (uniqueSeatNumbers.size !== seatNumbers.length) {
    const error = new Error('Duplicate seat numbers specified within passenger list');
    error.statusCode = 400;
    throw error;
  }

  // Calculate passenger fares and total fare
  const farePerSeat = trip.fare;
  const processedPassengers = passengers.map((p) => ({
    name: p.name.trim(),
    age: p.age,
    gender: p.gender || 'male',
    seatNumber: p.seatNumber.trim().toUpperCase(),
    fare: farePerSeat
  }));
  const totalFare = farePerSeat * processedPassengers.length;

  // Generate unique PNR
  let pnr = generatePNR();
  let existingBooking = await Booking.findOne({ pnr });
  while (existingBooking) {
    pnr = generatePNR();
    existingBooking = await Booking.findOne({ pnr });
  }

  // Check if MongoDB session / transactions are supported
  let session = null;
  let useTransactions = false;

  try {
    session = await mongoose.startSession();
    // Test if replica set is active
    if (mongoose.connection.client.topology && mongoose.connection.client.topology.description.type !== 'Single') {
      useTransactions = true;
    }
  } catch (err) {
    // Session not supported (e.g. mock or in-memory)
    session = null;
  }

  if (useTransactions && session) {
    try {
      let createdBooking;
      await session.withTransaction(async () => {
        // a. Check if any seat is already confirmed
        const existingAllocations = await SeatAllocation.find({
          trip: tripId,
          seatNumber: { $in: seatNumbers },
          status: 'confirmed'
        }).session(session);

        if (existingAllocations.length > 0) {
          const taken = existingAllocations.map((a) => a.seatNumber).join(', ');
          const error = new Error(`The following seats are already booked: ${taken}`);
          error.statusCode = 409;
          throw error;
        }

        // b. Create Booking document
        const [booking] = await Booking.create(
          [
            {
              pnr,
              user: userId,
              trip: tripId,
              passengers: processedPassengers,
              totalFare,
              status: 'confirmed',
              paymentStatus: 'paid',
              boardingPoint: boardingPointId || (trip.boardingPoints[0] ? trip.boardingPoints[0].stop : null),
              droppingPoint: droppingPointId || (trip.droppingPoints[0] ? trip.droppingPoints[0].stop : null),
              bookedAt: new Date()
            }
          ],
          { session }
        );

        createdBooking = booking;

        // c. Create SeatAllocation documents
        const seatAllocations = processedPassengers.map((p) => ({
          trip: tripId,
          seatNumber: p.seatNumber,
          booking: booking._id,
          passengerName: p.name,
          status: 'confirmed'
        }));

        await SeatAllocation.insertMany(seatAllocations, { session });

        // d. Update trip available seats
        await Trip.findByIdAndUpdate(
          tripId,
          { $inc: { availableSeats: -processedPassengers.length } },
          { session }
        );
      });

      await logAudit({
        user: userId,
        action: 'CREATE_BOOKING',
        resource: 'Booking',
        resourceId: createdBooking._id,
        details: { pnr: createdBooking.pnr, tripId, seats: seatNumbers, totalFare },
        ip
      });

      return Booking.findById(createdBooking._id)
        .populate('user', 'name email phone')
        .populate({
          path: 'trip',
          populate: [
            { path: 'bus', select: 'busNumber name type amenities' },
            {
              path: 'route',
              populate: [
                { path: 'source', select: 'name city state' },
                { path: 'destination', select: 'name city state' }
              ]
            }
          ]
        })
        .populate('boardingPoint', 'name city state')
        .populate('droppingPoint', 'name city state');
    } catch (err) {
      if (err.code === 11000) {
        const error = new Error('One or more selected seats were just taken. Please choose other seats.');
        error.statusCode = 409;
        throw error;
      }
      throw err;
    } finally {
      session.endSession();
    }
  } else {
    // Standalone MongoDB execution with rollback on race condition
    if (session) {
      session.endSession();
    }

    // a. Check existing allocations
    const existingAllocations = await SeatAllocation.find({
      trip: tripId,
      seatNumber: { $in: seatNumbers },
      status: 'confirmed'
    });

    if (existingAllocations.length > 0) {
      const taken = existingAllocations.map((a) => a.seatNumber).join(', ');
      const error = new Error(`The following seats are already booked: ${taken}`);
      error.statusCode = 409;
      throw error;
    }

    let createdBooking = null;
    let createdAllocations = [];

    try {
      // b. Create Booking
      createdBooking = await Booking.create({
        pnr,
        user: userId,
        trip: tripId,
        passengers: processedPassengers,
        totalFare,
        status: 'confirmed',
        paymentStatus: 'paid',
        boardingPoint: boardingPointId || (trip.boardingPoints[0] ? trip.boardingPoints[0].stop : null),
        droppingPoint: droppingPointId || (trip.droppingPoints[0] ? trip.droppingPoints[0].stop : null),
        bookedAt: new Date()
      });

      // c. Create SeatAllocations (Mongoose partial unique index prevents duplicate confirmed seats)
      const seatAllocations = processedPassengers.map((p) => ({
        trip: tripId,
        seatNumber: p.seatNumber,
        booking: createdBooking._id,
        passengerName: p.name,
        status: 'confirmed'
      }));

      createdAllocations = await SeatAllocation.insertMany(seatAllocations);

      // d. Decrement available seats
      await Trip.findByIdAndUpdate(tripId, {
        $inc: { availableSeats: -processedPassengers.length }
      });

      await logAudit({
        user: userId,
        action: 'CREATE_BOOKING',
        resource: 'Booking',
        resourceId: createdBooking._id,
        details: { pnr: createdBooking.pnr, tripId, seats: seatNumbers, totalFare },
        ip
      });

      return Booking.findById(createdBooking._id)
        .populate('user', 'name email phone')
        .populate({
          path: 'trip',
          populate: [
            { path: 'bus', select: 'busNumber name type amenities' },
            {
              path: 'route',
              populate: [
                { path: 'source', select: 'name city state' },
                { path: 'destination', select: 'name city state' }
              ]
            }
          ]
        })
        .populate('boardingPoint', 'name city state')
        .populate('droppingPoint', 'name city state');
    } catch (err) {
      // Rollback on duplicate key or any other failure
      if (createdBooking) {
        await Booking.findByIdAndDelete(createdBooking._id);
      }
      if (createdAllocations.length > 0) {
        await SeatAllocation.deleteMany({ booking: createdBooking._id });
      }

      if (err.code === 11000) {
        const error = new Error('One or more selected seats were just taken. Please choose other seats.');
        error.statusCode = 409;
        throw error;
      }
      throw err;
    }
  }
};

const getBookings = async (user, filter = {}) => {
  const query = {};

  if (user.role === 'customer') {
    query.user = user._id;
  } else if (user.role === 'operator') {
    // Find all trips operated by this operator
    const trips = await Trip.find({ operator: user._id }).select('_id');
    const tripIds = trips.map((t) => t._id);
    query.trip = { $in: tripIds };
  }
  // Admin sees all bookings (no query.user restriction)

  if (filter.status) {
    query.status = filter.status;
  }

  return Booking.find(query)
    .populate('user', 'name email phone')
    .populate({
      path: 'trip',
      populate: [
        { path: 'bus', select: 'busNumber name type amenities' },
        {
          path: 'route',
          populate: [
            { path: 'source', select: 'name city state' },
            { path: 'destination', select: 'name city state' }
          ]
        }
      ]
    })
    .populate('boardingPoint', 'name city state')
    .populate('droppingPoint', 'name city state')
    .sort({ createdAt: -1 });
};

const getBookingById = async (id, user) => {
  const booking = await Booking.findById(id)
    .populate('user', 'name email phone')
    .populate({
      path: 'trip',
      populate: [
        { path: 'bus', select: 'busNumber name type amenities' },
        {
          path: 'route',
          populate: [
            { path: 'source', select: 'name city state' },
            { path: 'destination', select: 'name city state' }
          ]
        },
        { path: 'operator', select: 'name email phone' }
      ]
    })
    .populate('boardingPoint', 'name city state')
    .populate('droppingPoint', 'name city state');

  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  // Authorization check
  if (user.role === 'customer' && booking.user._id.toString() !== user._id.toString()) {
    const error = new Error('Access denied. You can only view your own bookings.');
    error.statusCode = 403;
    throw error;
  }

  if (user.role === 'operator') {
    const tripOperatorId = booking.trip && booking.trip.operator ? booking.trip.operator._id.toString() : null;
    if (tripOperatorId !== user._id.toString()) {
      const error = new Error('Access denied. You can only view bookings for your assigned trips.');
      error.statusCode = 403;
      throw error;
    }
  }

  return booking;
};

const getBookingByPnr = async (pnr) => {
  const booking = await Booking.findOne({ pnr: pnr.trim().toUpperCase() })
    .populate('user', 'name email phone')
    .populate({
      path: 'trip',
      populate: [
        { path: 'bus', select: 'busNumber name type amenities' },
        {
          path: 'route',
          populate: [
            { path: 'source', select: 'name city state' },
            { path: 'destination', select: 'name city state' }
          ]
        }
      ]
    })
    .populate('boardingPoint', 'name city state')
    .populate('droppingPoint', 'name city state');

  if (!booking) {
    const error = new Error(`Booking with PNR '${pnr}' not found`);
    error.statusCode = 404;
    throw error;
  }

  return booking;
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  getBookingByPnr
};
