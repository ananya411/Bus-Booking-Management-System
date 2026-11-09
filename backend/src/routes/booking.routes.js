const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authenticate = require('../middleware/auth');
const { createBookingValidator } = require('../validators/booking.validator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Seat booking and ticket management
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get bookings (Customer views own; Admin views all)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, bookingController.getBookings);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking with seat allocation
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tripId
 *               - passengers
 *             properties:
 *               tripId:
 *                 type: string
 *               passengers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - age
 *                     - seatNumber
 *                   properties:
 *                     name:
 *                       type: string
 *                     age:
 *                       type: integer
 *                     gender:
 *                       type: string
 *                       enum: [male, female, other]
 *                     seatNumber:
 *                       type: string
 *     responses:
 *       201:
 *         description: Booking confirmed
 *       409:
 *         description: Seat conflict - seat already booked
 */
router.post('/', authenticate, createBookingValidator, validate, bookingController.createBooking);

/**
 * @swagger
 * /api/bookings/pnr/{pnr}:
 *   get:
 *     summary: Lookup booking by PNR number
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: pnr
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking found
 *       404:
 *         description: Booking not found
 */
router.get('/pnr/:pnr', bookingController.getBookingByPnr);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking details by ID
 *     tags: [Bookings]
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
 *         description: Booking details
 *       403:
 *         description: Forbidden - Not your booking
 *       404:
 *         description: Booking not found
 */
router.get('/:id', authenticate, bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   post:
 *     summary: Cancel booking and release allocated seats
 *     tags: [Bookings]
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
 *         description: Booking cancelled and refund calculated
 *       400:
 *         description: Already cancelled or invalid state
 *       403:
 *         description: Forbidden
 */
router.post('/:id/cancel', authenticate, bookingController.cancelBooking);

module.exports = router;
