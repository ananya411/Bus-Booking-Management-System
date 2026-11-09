const routeService = require('../services/route.service');
const { successResponse } = require('../utils/response');

const getAllRoutes = async (req, res, next) => {
  try {
    const routes = await routeService.getAllRoutes();
    return successResponse(res, routes, 'Routes retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getRouteById = async (req, res, next) => {
  try {
    const route = await routeService.getRouteById(req.params.id);
    return successResponse(res, route, 'Route retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const createRoute = async (req, res, next) => {
  try {
    const route = await routeService.createRoute(req.body);
    return successResponse(res, route, 'Route created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateRoute = async (req, res, next) => {
  try {
    const route = await routeService.updateRoute(req.params.id, req.body);
    return successResponse(res, route, 'Route updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

const deleteRoute = async (req, res, next) => {
  try {
    const result = await routeService.deleteRoute(req.params.id);
    return successResponse(res, result, 'Route deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute
};
