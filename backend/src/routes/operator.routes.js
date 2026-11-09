const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operator.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

/**
 * @swagger
 * tags:
 *   name: Operator
 *   description: Operator specific actions and trip manifests
 */

/**
 * @swagger
 * /api/operators/trips:
 *   get:
 *     summary: Get trips assigned to the logged-in operator
 *     tags: [Operator]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned trips
 *       403:
 *         description: Forbidden - Operator or Admin only
 */
router.get(
  '/trips',
  authenticate,
  authorize('operator', 'admin'),
  operatorController.getOperatorTrips
);

/**
 * @swagger
 * /api/operators/trips/{tripId}/manifest:
 *   get:
 *     summary: Get passenger manifest for a specific trip
 *     tags: [Operator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Complete passenger manifest with boarding & seat details
 *       403:
 *         description: Forbidden - Not assigned to this trip
 *       404:
 *         description: Trip not found
 */
router.get(
  '/trips/:tripId/manifest',
  authenticate,
  authorize('operator', 'admin'),
  operatorController.getTripManifest
);

module.exports = router;
