const express = require('express');
const router = express.Router();
const busController = require('../controllers/bus.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { auditLogger } = require('../middleware/auditLogger');
const { createBusValidator, updateBusValidator } = require('../validators/bus.validator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Buses
 *   description: Bus management endpoints
 */

/**
 * @swagger
 * /api/buses:
 *   get:
 *     summary: Get all buses
 *     tags: [Buses]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of buses
 */
router.get('/', busController.getAllBuses);

/**
 * @swagger
 * /api/buses/my:
 *   get:
 *     summary: Get buses belonging to the logged-in operator
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of operator's buses
 */
router.get('/my', authenticate, authorize('operator', 'admin'), busController.getMyBuses);

/**
 * @swagger
 * /api/buses/{id}:
 *   get:
 *     summary: Get bus by ID
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bus details
 *       404:
 *         description: Bus not found
 */
router.get('/:id', busController.getBusById);

/**
 * @swagger
 * /api/buses:
 *   post:
 *     summary: Create a new bus (Admin only)
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - busNumber
 *               - name
 *               - type
 *               - totalSeats
 *               - seatLayout
 *     responses:
 *       201:
 *         description: Bus created successfully
 *       403:
 *         description: Forbidden - Admin only
 */
router.post(
  '/',
  authenticate,
  authorize('operator', 'admin'),
  createBusValidator,
  validate,
  auditLogger('CREATE_BUS', 'Bus'),
  busController.createBus
);

/**
 * @swagger
 * /api/buses/{id}:
 *   put:
 *     summary: Update an existing bus (Operator or Admin)
 *     tags: [Buses]
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
 *         description: Bus updated successfully
 *       403:
 *         description: Forbidden - Operator or Admin only
 */
router.put(
  '/:id',
  authenticate,
  authorize('operator', 'admin'),
  updateBusValidator,
  validate,
  auditLogger('UPDATE_BUS', 'Bus'),
  busController.updateBus
);

/**
 * @swagger
 * /api/buses/{id}:
 *   delete:
 *     summary: Delete a bus (Operator or Admin)
 *     tags: [Buses]
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
 *         description: Bus deleted successfully
 *       403:
 *         description: Forbidden - Operator or Admin only
 */
router.delete(
  '/:id',
  authenticate,
  authorize('operator', 'admin'),
  auditLogger('DELETE_BUS', 'Bus'),
  busController.deleteBus
);

module.exports = router;
