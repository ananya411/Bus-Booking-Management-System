const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['window', 'aisle', 'middle'],
      default: 'window'
    },
    deck: {
      type: String,
      enum: ['lower', 'upper'],
      default: 'lower'
    }
  },
  { _id: false }
);

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: [true, 'Bus number is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Bus name is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Bus type is required'],
      enum: {
        values: ['AC Sleeper', 'AC Seater', 'Non-AC Sleeper', 'Non-AC Seater', 'Volvo', 'Mini'],
        message: 'Invalid bus type'
      }
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats count is required'],
      min: [1, 'Total seats must be at least 1']
    },
    seatLayout: {
      rows: {
        type: Number,
        required: true,
        min: 1
      },
      seatsPerRow: {
        type: Number,
        required: true,
        min: 1
      },
      layout: {
        type: [[seatSchema]],
        required: true,
        default: []
      }
    },
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amenities: {
      type: [String],
      default: ['Water Bottle', 'Charging Point']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
