const bookingService = require('../services/booking.service');
const cancellationService = require('../services/cancellation.service');
const { successResponse } = require('../utils/response');

const createBooking = async (req, res, next) => {
  try {
    const tripId = req.body.tripId || req.body.trip_id;
    const rawPassengers = req.body.passengers || [];
    const passengers = rawPassengers.map((p) => ({
      name: p.name,
      age: Number(p.age),
      gender: p.gender || 'male',
      seatNumber: (p.seatNumber || p.seat_number || '').toString().trim().toUpperCase(),
    }));
    const boardingPoint = req.body.boardingPoint || req.body.boarding_point;
    const droppingPoint = req.body.droppingPoint || req.body.dropping_point;

    const booking = await bookingService.createBooking(
      req.user._id,
      tripId,
      passengers,
      boardingPoint,
      droppingPoint,
      req.ip
    );
    return successResponse(res, booking, 'Booking created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getBookings(req.user, req.query);
    return successResponse(res, bookings, 'Bookings retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id, req.user);
    return successResponse(res, booking, 'Booking details retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getBookingByPnr = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingByPnr(req.params.pnr);
    return successResponse(res, booking, 'Booking found for PNR', 200);
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const result = await cancellationService.cancelBooking(
      req.params.id,
      req.user,
      req.user.role,
      req.ip,
      req.body.reason || ''
    );
    return successResponse(res, result, 'Booking cancelled successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  getBookingByPnr,
  cancelBooking,
};
