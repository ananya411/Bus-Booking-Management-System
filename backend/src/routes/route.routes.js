const express = require('express');
const router = express.Router();
const routeController = require('../controllers/route.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { auditLogger } = require('../middleware/auditLogger');
const { createRouteValidator, updateRouteValidator } = require('../validators/route.validator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Routes
 *   description: Route management endpoints
 */

/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Get all routes
 *     tags: [Routes]
 *     responses:
 *       200:
 *         description: List of routes
 */
router.get('/', routeController.getAllRoutes);

/**
 * @swagger
 * /api/routes/{id}:
 *   get:
 *     summary: Get route by ID
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Route details
 *       404:
 *         description: Route not found
 */
router.get('/:id', routeController.getRouteById);

/**
 * @swagger
 * /api/routes:
 *   post:
 *     summary: Create a new route (Admin only)
 *     tags: [Routes]
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
 *               - source
 *               - destination
 *     responses:
 *       201:
 *         description: Route created successfully
 *       403:
 *         description: Forbidden - Admin only
 */
router.post(
  '/',
  authenticate,
  authorize('operator', 'admin'),
  createRouteValidator,
  validate,
  auditLogger('CREATE_ROUTE', 'Route'),
  routeController.createRoute
);

/**
 * @swagger
 * /api/routes/{id}:
 *   put:
 *     summary: Update route by ID (Admin only)
 *     tags: [Routes]
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
 *         description: Route updated successfully
 *       403:
 *         description: Forbidden - Admin only
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  updateRouteValidator,
  validate,
  auditLogger('UPDATE_ROUTE', 'Route'),
  routeController.updateRoute
);

/**
 * @swagger
 * /api/routes/{id}:
 *   delete:
 *     summary: Delete route by ID (Admin only)
 *     tags: [Routes]
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
 *         description: Route deleted successfully
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  auditLogger('DELETE_ROUTE', 'Route'),
  routeController.deleteRoute
);

module.exports = router;
