const User = require('../models/user.model');
const Bus = require('../models/bus.model');
const Route = require('../models/route.model');
const Trip = require('../models/trip.model');
const Booking = require('../models/booking.model');
const SeatAllocation = require('../models/seatAllocation.model');

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalBuses,
    totalRoutes,
    totalTrips,
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    revenueAggregation
  ] = await Promise.all([
    User.countDocuments(),
    Bus.countDocuments(),
    Route.countDocuments(),
    Trip.countDocuments(),
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'confirmed' }),
    Booking.countDocuments({ status: 'cancelled' }),
    Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalFare' } } }
    ])
  ]);

  const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

  // Active / upcoming trips
  const activeTripsCount = await Trip.countDocuments({
    status: { $in: ['scheduled', 'in-progress'] },
    travelDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
  });

  return {
    totalUsers,
    totalBuses,
    totalRoutes,
    totalTrips,
    activeTripsCount,
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    totalRevenue
  };
};

const getRevenueReport = async (startDate, endDate) => {
  const matchCondition = { status: 'confirmed' };

  if (startDate || endDate) {
    matchCondition.createdAt = {};
    if (startDate) {
      matchCondition.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchCondition.createdAt.$lte = end;
    }
  }

  const revenueByDay = await Booking.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalFare' },
        bookingsCount: { $sum: 1 },
        totalPassengers: { $sum: { $size: '$passengers' } }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const totals = revenueByDay.reduce(
    (acc, curr) => {
      acc.totalRevenue += curr.revenue;
      acc.totalBookings += curr.bookingsCount;
      acc.totalPassengers += curr.totalPassengers;
      return acc;
    },
    { totalRevenue: 0, totalBookings: 0, totalPassengers: 0 }
  );

  return {
    summary: totals,
    dailyBreakdown: revenueByDay.map((item) => ({
      date: item._id,
      revenue: item.revenue,
      bookingsCount: item.bookingsCount,
      passengersCount: item.totalPassengers
    }))
  };
};

const getOccupancyReport = async () => {
  const trips = await Trip.find()
    .populate('bus', 'busNumber name totalSeats')
    .populate({
      path: 'route',
      populate: [
        { path: 'source', select: 'name city' },
        { path: 'destination', select: 'name city' }
      ]
    })
    .sort({ travelDate: -1 });

  const tripOccupancies = await Promise.all(
    trips.map(async (trip) => {
      const totalSeats = trip.bus ? trip.bus.totalSeats : 40;
      const bookedSeatsCount = await SeatAllocation.countDocuments({
        trip: trip._id,
        status: 'confirmed'
      });

      const occupancyRate = totalSeats > 0 ? ((bookedSeatsCount / totalSeats) * 100).toFixed(2) : 0;

      return {
        tripId: trip._id,
        busNumber: trip.bus ? trip.bus.busNumber : 'N/A',
        busName: trip.bus ? trip.bus.name : 'N/A',
        route: trip.route ? `${trip.route.source.city} -> ${trip.route.destination.city}` : 'N/A',
        travelDate: trip.travelDate,
        departureTime: trip.departureTime,
        status: trip.status,
        totalSeats,
        bookedSeats: bookedSeatsCount,
        availableSeats: trip.availableSeats,
        occupancyPercentage: Number(occupancyRate)
      };
    })
  );

  return tripOccupancies;
};

module.exports = {
  getDashboardStats,
  getRevenueReport,
  getOccupancyReport
};
