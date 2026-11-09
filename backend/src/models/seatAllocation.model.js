const mongoose = require('mongoose');

const seatAllocationSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip reference is required']
    },
    seatNumber: {
      type: String,
      required: [true, 'Seat number is required'],
      trim: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking reference is required']
    },
    passengerName: {
      type: String,
      required: [true, 'Passenger name is required'],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['confirmed', 'cancelled'],
        message: 'Invalid seat allocation status'
      },
      default: 'confirmed'
    }
  },
  {
    timestamps: true
  }
);

// CRITICAL: Partial unique compound index
// Prevents double-booking for the same trip and seatNumber while status is 'confirmed'.
// When cancelled, the seat is freed and can be allocated again.
seatAllocationSchema.index(
  { trip: 1, seatNumber: 1 },
  { unique: true, partialFilterExpression: { status: 'confirmed' } }
);

const SeatAllocation = mongoose.model('SeatAllocation', seatAllocationSchema);

module.exports = SeatAllocation;
