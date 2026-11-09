const stopService = require('../services/stop.service');
const { successResponse } = require('../utils/response');

const getAllStops = async (req, res, next) => {
  try {
    const stops = await stopService.getAllStops(req.query.search);
    return successResponse(res, stops, 'Stops retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getStopById = async (req, res, next) => {
  try {
    const stop = await stopService.getStopById(req.params.id);
    return successResponse(res, stop, 'Stop retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const createStop = async (req, res, next) => {
  try {
    const stop = await stopService.createStop(req.body);
    return successResponse(res, stop, 'Stop created successfully', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStops,
  getStopById,
  createStop
};
