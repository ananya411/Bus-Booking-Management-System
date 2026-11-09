const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stop.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { auditLogger } = require('../middleware/auditLogger');
const { createStopValidator } = require('../validators/stop.validator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Stops
 *   description: Bus stops and stations management
 */

/**
 * @swagger
 * /api/stops:
 *   get:
 *     summary: Get all bus stops
 *     tags: [Stops]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bus stops
 */
router.get('/', stopController.getAllStops);

/**
 * @swagger
 * /api/stops/{id}:
 *   get:
 *     summary: Get bus stop by ID
 *     tags: [Stops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stop details
 *       404:
 *         description: Stop not found
 */
router.get('/:id', stopController.getStopById);

/**
 * @swagger
 * /api/stops:
 *   post:
 *     summary: Create a new bus stop (Admin only)
 *     tags: [Stops]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - city
 *               - state
 *             properties:
 *               name:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *     responses:
 *       201:
 *         description: Stop created successfully
 *       403:
 *         description: Forbidden - Admin only
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  createStopValidator,
  validate,
  auditLogger('CREATE_STOP', 'Stop'),
  stopController.createStop
);

module.exports = router;
