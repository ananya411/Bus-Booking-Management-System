const Bus = require('../models/bus.model');

const getAllBuses = async (filter = {}) => {
  const query = {};
  if (filter.type) query.type = filter.type;
  if (filter.isActive !== undefined) query.isActive = filter.isActive;
  if (filter.operator) query.operator = filter.operator;

  return Bus.find(query).populate('operator', 'name email phone').sort({ createdAt: -1 });
};

const getBusById = async (id) => {
  const bus = await Bus.findById(id).populate('operator', 'name email phone');
  if (!bus) {
    const error = new Error('Bus not found');
    error.statusCode = 404;
    throw error;
  }
  return bus;
};

const createBus = async (busData) => {
  const existing = await Bus.findOne({ busNumber: busData.busNumber.toUpperCase() });
  if (existing) {
    const error = new Error(`Bus with number '${busData.busNumber}' already exists`);
    error.statusCode = 400;
    throw error;
  }

  // If layout is not explicitly provided, generate default layout based on rows and seatsPerRow
  if (!busData.seatLayout.layout || busData.seatLayout.layout.length === 0) {
    const rows = busData.seatLayout.rows;
    const seatsPerRow = busData.seatLayout.seatsPerRow;
    const layout = [];
    let seatCounter = 1;

    for (let r = 0; r < rows; r++) {
      const rowSeats = [];
      for (let s = 0; s < seatsPerRow; s++) {
        let seatType = 'middle';
        if (s === 0 || s === seatsPerRow - 1) {
          seatType = 'window';
        } else if (s === 1 || s === seatsPerRow - 2) {
          seatType = 'aisle';
        }
        rowSeats.push({
          seatNumber: `S${seatCounter}`,
          type: seatType,
          deck: 'lower'
        });
        seatCounter++;
      }
      layout.push(rowSeats);
    }
    busData.seatLayout.layout = layout;
  }

  return Bus.create(busData);
};

const updateBus = async (id, busData) => {
  const bus = await Bus.findById(id);
  if (!bus) {
    const error = new Error('Bus not found');
    error.statusCode = 404;
    throw error;
  }

  if (busData.busNumber && busData.busNumber.toUpperCase() !== bus.busNumber) {
    const existing = await Bus.findOne({ busNumber: busData.busNumber.toUpperCase() });
    if (existing) {
      const error = new Error(`Bus with number '${busData.busNumber}' already exists`);
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedBus = await Bus.findByIdAndUpdate(id, busData, {
    new: true,
    runValidators: true
  }).populate('operator', 'name email phone');

  return updatedBus;
};

const deleteBus = async (id) => {
  const bus = await Bus.findById(id);
  if (!bus) {
    const error = new Error('Bus not found');
    error.statusCode = 404;
    throw error;
  }
  await Bus.findByIdAndDelete(id);
  return { id };
};

module.exports = {
  getAllBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus
};
