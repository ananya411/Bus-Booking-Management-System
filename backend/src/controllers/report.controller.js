const reportService = require('../services/report.service');
const { successResponse } = require('../utils/response');

const getDashboard = async (req, res, next) => {
  try {
    const stats = await reportService.getDashboardStats();
    return successResponse(res, stats, 'Dashboard statistics retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getRevenue = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const revenueReport = await reportService.getRevenueReport(startDate, endDate);
    return successResponse(res, revenueReport, 'Revenue report retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getOccupancy = async (req, res, next) => {
  try {
    const occupancyReport = await reportService.getOccupancyReport();
    return successResponse(res, occupancyReport, 'Occupancy report retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getRevenue,
  getOccupancy
};
