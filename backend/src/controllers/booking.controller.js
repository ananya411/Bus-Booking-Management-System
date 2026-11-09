const bookingService = require('../services/booking.service');
const cancellationService = require('../services/cancellation.service');
const { successResponse } = require('../utils/response');

const createBooking = async (req, res, next) => {
  try {
    const { tripId, passengers, boardingPoint, droppingPoint } = req.body;
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
    const booking = await cancellationService.cancelBooking(
      req.params.id,
      req.user._id,
      req.user.role,
      req.ip
    );
    return successResponse(res, booking, 'Booking cancelled successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  getBookingByPnr,
  cancelBooking
};
