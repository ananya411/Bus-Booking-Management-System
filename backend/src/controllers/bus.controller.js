const busService = require('../services/bus.service');
const { successResponse } = require('../utils/response');

const getAllBuses = async (req, res, next) => {
  try {
    const filter = { ...req.query };
    const buses = await busService.getAllBuses(filter);
    return successResponse(res, buses, 'Buses retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getMyBuses = async (req, res, next) => {
  try {
    const filter = { ...req.query };
    if (req.user && req.user.role === 'operator') {
      filter.operator = req.user._id;
    }
    const buses = await busService.getAllBuses(filter);
    return successResponse(res, buses, 'Operator buses retrieved successfully', 200);
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
    const busData = { ...req.body };
    if (req.user && req.user.role === 'operator') {
      busData.operator = req.user._id;
    }
    const bus = await busService.createBus(busData);
    return successResponse(res, bus, 'Bus created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateBus = async (req, res, next) => {
  try {
    const bus = await busService.updateBus(req.params.id, req.body, req.user);
    return successResponse(res, bus, 'Bus updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

const deleteBus = async (req, res, next) => {
  try {
    const result = await busService.deleteBus(req.params.id, req.user);
    return successResponse(res, result, 'Bus deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBuses,
  getMyBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus
};
