const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Analytics, revenue, and occupancy reports (Admin only)
 */

/**
 * @swagger
 * /api/reports/dashboard:
 *   get:
 *     summary: Get overview metrics and counts
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/dashboard', authenticate, authorize('admin'), reportController.getDashboard);

/**
 * @swagger
 * /api/reports/revenue:
 *   get:
 *     summary: Get revenue breakdown by date range
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Revenue figures and daily breakdown
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/revenue', authenticate, authorize('admin'), reportController.getRevenue);

/**
 * @swagger
 * /api/reports/occupancy:
 *   get:
 *     summary: Get seat occupancy rates across trips
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Occupancy rates per trip
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/occupancy', authenticate, authorize('admin'), reportController.getOccupancy);

module.exports = router;
