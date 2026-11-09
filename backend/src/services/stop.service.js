const Stop = require('../models/stop.model');

const getAllStops = async (search) => {
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { state: { $regex: search, $options: 'i' } }
    ];
  }
  return Stop.find(query).sort({ city: 1, name: 1 });
};

const getStopById = async (id) => {
  const stop = await Stop.findById(id);
  if (!stop) {
    const error = new Error('Stop not found');
    error.statusCode = 404;
    throw error;
  }
  return stop;
};

const createStop = async (stopData) => {
  const existing = await Stop.findOne({ name: stopData.name.trim() });
  if (existing) {
    const error = new Error(`Stop with name '${stopData.name}' already exists`);
    error.statusCode = 400;
    throw error;
  }
  return Stop.create(stopData);
};

module.exports = {
  getAllStops,
  getStopById,
  createStop
};
