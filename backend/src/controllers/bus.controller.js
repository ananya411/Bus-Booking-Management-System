const busService = require('../services/bus.service');
const { successResponse } = require('../utils/response');

const getAllBuses = async (req, res, next) => {
  try {
    const buses = await busService.getAllBuses(req.query);
    return successResponse(res, buses, 'Buses retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getBusById = async (req, res, next) => {
  try {
    const bus = await busService.getBusById(req.params.id);
    return successResponse(res, bus, 'Bus retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const createBus = async (req, res, next) => {
  try {
    const bus = await busService.createBus(req.body);
    return successResponse(res, bus, 'Bus created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateBus = async (req, res, next) => {
  try {
    const bus = await busService.updateBus(req.params.id, req.body);
    return successResponse(res, bus, 'Bus updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

const deleteBus = async (req, res, next) => {
  try {
    const result = await busService.deleteBus(req.params.id);
    return successResponse(res, result, 'Bus deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus
};
