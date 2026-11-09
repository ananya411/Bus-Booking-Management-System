const mongoose = require('mongoose');

const intermediateStopSchema = new mongoose.Schema(
  {
    stop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stop',
      required: true
    },
    arrivalOffset: {
      type: Number, // in minutes from route departure
      default: 0
    },
    departureOffset: {
      type: Number, // in minutes from route departure
      default: 0
    },
    distanceFromSource: {
      type: Number, // in km
      default: 0
    }
  },
  { _id: false }
);

const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Route name is required'],
      trim: true
    },
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stop',
      required: [true, 'Source stop is required']
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stop',
      required: [true, 'Destination stop is required']
    },
    stops: {
      type: [intermediateStopSchema],
      default: []
    },
    totalDistance: {
      type: Number,
      default: 0,
      min: 0
    },
    estimatedDuration: {
      type: Number, // total minutes or hours
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
