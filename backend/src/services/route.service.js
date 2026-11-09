const Route = require('../models/route.model');

const getAllRoutes = async () => {
  return Route.find()
    .populate('source', 'name city state')
    .populate('destination', 'name city state')
    .populate('stops.stop', 'name city state')
    .sort({ createdAt: -1 });
};

const getRouteById = async (id) => {
  const route = await Route.findById(id)
    .populate('source', 'name city state')
    .populate('destination', 'name city state')
    .populate('stops.stop', 'name city state');

  if (!route) {
    const error = new Error('Route not found');
    error.statusCode = 404;
    throw error;
  }
  return route;
};

const createRoute = async (routeData) => {
  if (routeData.source === routeData.destination) {
    const error = new Error('Source and destination cannot be the same');
    error.statusCode = 400;
    throw error;
  }

  const route = await Route.create(routeData);
  return Route.findById(route._id)
    .populate('source', 'name city state')
    .populate('destination', 'name city state')
    .populate('stops.stop', 'name city state');
};

const updateRoute = async (id, routeData) => {
  const route = await Route.findById(id);
  if (!route) {
    const error = new Error('Route not found');
    error.statusCode = 404;
    throw error;
  }

  const updatedRoute = await Route.findByIdAndUpdate(id, routeData, {
    new: true,
    runValidators: true
  })
    .populate('source', 'name city state')
    .populate('destination', 'name city state')
    .populate('stops.stop', 'name city state');

  return updatedRoute;
};

const deleteRoute = async (id) => {
  const route = await Route.findById(id);
  if (!route) {
    const error = new Error('Route not found');
    error.statusCode = 404;
    throw error;
  }
  await Route.findByIdAndDelete(id);
  return { id };
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute
};
