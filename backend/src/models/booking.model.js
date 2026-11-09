const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Passenger name is required'],
      trim: true
    },
    age: {
      type: Number,
      required: [true, 'Passenger age is required'],
      min: [1, 'Age must be at least 1']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male'
    },
    seatNumber: {
      type: String,
      required: [true, 'Seat number is required'],
      trim: true
    },
    fare: {
      type: Number,
      required: [true, 'Fare per passenger is required'],
      min: [0, 'Fare cannot be negative']
    }
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    pnr: {
      type: String,
      required: [true, 'PNR is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip is required']
    },
    passengers: {
      type: [passengerSchema],
      required: [true, 'Passengers list is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one passenger must be included'
      }
    },
    totalFare: {
      type: Number,
      required: [true, 'Total fare is required'],
      min: [0, 'Total fare cannot be negative']
    },
    status: {
      type: String,
      enum: {
        values: ['confirmed', 'cancelled', 'pending'],
        message: 'Invalid booking status'
      },
      default: 'confirmed'
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['paid', 'refund_pending', 'refunded', 'not_applicable'],
        message: 'Invalid payment status'
      },
      default: 'paid'
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    cancellationTime: {
      type: Date
    },
    boardingPoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stop'
    },
    droppingPoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stop'
    },
    bookedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ pnr: 1 });
bookingSchema.index({ trip: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
