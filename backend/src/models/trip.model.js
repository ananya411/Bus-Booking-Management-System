const mongoose = require('mongoose');

const tripPointSchema = new mongoose.Schema(
  {
    stop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stop',
      required: true
    },
    time: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: [true, 'Bus is required']
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: [true, 'Route is required']
    },
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required']
    },
    departureTime: {
      type: String,
      required: [true, 'Departure time is required'],
      trim: true
    },
    arrivalTime: {
      type: String,
      required: [true, 'Arrival time is required'],
      trim: true
    },
    fare: {
      type: Number,
      required: [true, 'Fare is required'],
      min: [0, 'Fare cannot be negative']
    },
    boardingPoints: {
      type: [tripPointSchema],
      default: []
    },
    droppingPoints: {
      type: [tripPointSchema],
      default: []
    },
    status: {
      type: String,
      enum: {
        values: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        message: 'Invalid trip status'
      },
      default: 'scheduled'
    },
    availableSeats: {
      type: Number,
      required: [true, 'Available seats count is required'],
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes for searching trips
tripSchema.index({ travelDate: 1, route: 1, status: 1 });
tripSchema.index({ operator: 1 });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
