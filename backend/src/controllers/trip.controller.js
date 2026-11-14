const tripService = require('../services/trip.service');
const { successResponse } = require('../utils/response');

const searchTrips = async (req, res, next) => {
  try {
    const { source, destination, date } = req.query;
    const trips = await tripService.searchTrips({ source, destination, date });
    return successResponse(res, trips, `Found ${trips.length} trips matching criteria`, 200);
  } catch (error) {
    next(error);
  }
};

const getAllTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getAllTrips(req.query);
    return successResponse(res, trips, 'Trips retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    return successResponse(res, trip, 'Trip details retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getTripSeats = async (req, res, next) => {
  try {
    const seatsData = await tripService.getTripSeats(req.params.id);
    return successResponse(res, seatsData, 'Seat layout and availability retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const createTrip = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      bus: req.body.bus || req.body.bus_id,
      route: req.body.route || req.body.route_id,
      travelDate: req.body.travelDate || req.body.trip_date,
      departureTime: req.body.departureTime || req.body.departure_time,
      arrivalTime: req.body.arrivalTime || req.body.arrival_time,
    };
    if (req.user && req.user.role === 'operator') {
      payload.operator = req.user._id;
    }
    const trip = await tripService.createTrip(payload, req.user);
    return successResponse(res, trip, 'Trip scheduled successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      bus: req.body.bus || req.body.bus_id,
      route: req.body.route || req.body.route_id,
      travelDate: req.body.travelDate || req.body.trip_date,
      departureTime: req.body.departureTime || req.body.departure_time,
      arrivalTime: req.body.arrivalTime || req.body.arrival_time,
    };
    const trip = await tripService.updateTrip(req.params.id, payload, req.user);
    return successResponse(res, trip, 'Trip updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const result = await tripService.deleteTrip(req.params.id, req.user);
    return successResponse(res, result, 'Trip deleted successfully', 200);
  } catch (error) {
    next(error);
  }
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
