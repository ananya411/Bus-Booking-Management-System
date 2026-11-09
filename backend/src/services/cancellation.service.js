const Booking = require('../models/booking.model');
const Trip = require('../models/trip.model');
const SeatAllocation = require('../models/seatAllocation.model');
const { logAudit } = require('../middleware/auditLogger');

/**
 * Calculates departure Date from Trip's travelDate and departureTime string
 */
const getTripDepartureDateTime = (travelDate, departureTime) => {
  const dateObj = new Date(travelDate);

  if (departureTime && departureTime.includes(':')) {
    const [hours, minutes] = departureTime.split(':').map((num) => parseInt(num, 10));
    dateObj.setHours(hours || 0, minutes || 0, 0, 0);
  }

  return dateObj;
};

/**
 * Cancels a booking, calculates refund, releases seats, and logs audit
 */
const cancelBooking = async (bookingId, userId, role, ip = '') => {
  // 1. Find booking
  const booking = await Booking.findById(bookingId).populate('trip');
  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  // 2. Check it belongs to user (or user is admin)
  if (role !== 'admin' && booking.user.toString() !== userId.toString()) {
    const error = new Error('Access denied. You can only cancel your own bookings.');
    error.statusCode = 403;
    throw error;
  }

  // 3. Check it is not already cancelled
  if (booking.status === 'cancelled') {
    const error = new Error('Booking is already cancelled');
    error.statusCode = 400;
    throw error;
  }

  // 4. Calculate refund based on departure time
  const trip = booking.trip;
  let refundPercentage = 0;

  if (trip) {
    const departureDateTime = getTripDepartureDateTime(trip.travelDate, trip.departureTime);
    const now = new Date();
    const diffHours = (departureDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours > 24) {
      refundPercentage = 0.8; // 80% refund
    } else if (diffHours >= 12 && diffHours <= 24) {
      refundPercentage = 0.5; // 50% refund
    } else {
      refundPercentage = 0.0; // 0% refund if < 12 hours or already departed
    }
  }

  const refundAmount = Math.round(booking.totalFare * refundPercentage * 100) / 100;
  const paymentStatus = refundAmount > 0 ? 'refund_pending' : 'not_applicable';

  // 5. Update SeatAllocation status to 'cancelled' for all seats in this booking
  await SeatAllocation.updateMany(
    { booking: booking._id },
    { $set: { status: 'cancelled' } }
  );

  // 6. Update Trip availableSeats += cancelled seats count
  if (trip) {
    await Trip.findByIdAndUpdate(trip._id, {
      $inc: { availableSeats: booking.passengers.length }
    });
  }

  // 7. Update Booking
  booking.status = 'cancelled';
  booking.refundAmount = refundAmount;
  booking.paymentStatus = paymentStatus;
  booking.cancellationTime = new Date();
  await booking.save();

  // 8. Log audit entry
  await logAudit({
    user: userId,
    action: 'CANCEL_BOOKING',
    resource: 'Booking',
    resourceId: booking._id,
    details: {
      pnr: booking.pnr,
      refundAmount,
      refundPercentage: `${refundPercentage * 100}%`,
      releasedSeatsCount: booking.passengers.length
    },
    ip
  });

  // 9. Return populated updated booking
  return Booking.findById(booking._id)
    .populate('user', 'name email phone')
    .populate({
      path: 'trip',
      populate: [
        { path: 'bus', select: 'busNumber name type' },
        {
          path: 'route',
          populate: [
            { path: 'source', select: 'name city state' },
            { path: 'destination', select: 'name city state' }
          ]
        }
      ]
    })
    .populate('boardingPoint', 'name city state')
    .populate('droppingPoint', 'name city state');
};

module.exports = {
  cancelBooking
};
