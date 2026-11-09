const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { auditLogger } = require('../middleware/auditLogger');
const { createTripValidator, updateTripValidator } = require('../validators/trip.validator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Trip schedules, search, and seat layouts
 */

/**
 * @swagger
 * /api/trips/search:
 *   get:
 *     summary: Search available trips by source, destination, and travel date
 *     tags: [Trips]
 *     parameters:
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: City name, stop name, or stop ID
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         description: City name, stop name, or stop ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Travel date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Matching scheduled trips
 */
router.get('/search', tripController.searchTrips);

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all trips with optional filters
 *     tags: [Trips]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: operator
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of trips
 */
router.get('/', tripController.getAllTrips);

/**
 * @swagger
 * /api/trips/{id}/seats:
 *   get:
 *     summary: Get seat layout and live booking availability for a trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bus seat layout with booking status per seat
 *       404:
 *         description: Trip not found
 */
router.get('/:id/seats', tripController.getTripSeats);

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Get trip details by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip details
 *       404:
 *         description: Trip not found
 */
router.get('/:id', tripController.getTripById);

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Schedule a new trip (Admin only)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bus
 *               - route
 *               - travelDate
 *               - departureTime
 *               - arrivalTime
 *               - fare
 *     responses:
 *       201:
 *         description: Trip scheduled successfully
 *       403:
 *         description: Forbidden - Admin only
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  createTripValidator,
  validate,
  auditLogger('CREATE_TRIP', 'Trip'),
  tripController.createTrip
);

/**
 * @swagger
 * /api/trips/{id}:
 *   put:
 *     summary: Update a trip schedule (Admin only)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       403:
 *         description: Forbidden - Admin only
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  updateTripValidator,
  validate,
  auditLogger('UPDATE_TRIP', 'Trip'),
  tripController.updateTrip
);

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Delete a trip (Admin only)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  auditLogger('DELETE_TRIP', 'Trip'),
  tripController.deleteTrip
);

module.exports = router;
