const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const busRoutes = require('./bus.routes');
const routeRoutes = require('./route.routes');
const stopRoutes = require('./stop.routes');
const tripRoutes = require('./trip.routes');
const bookingRoutes = require('./booking.routes');
const operatorRoutes = require('./operator.routes');
const reportRoutes = require('./report.routes');
const userRoutes = require('./user.routes');
const auditLogRoutes = require('./auditLog.routes');

router.use('/auth', authRoutes);
router.use('/buses', busRoutes);
router.use('/routes', routeRoutes);
router.use('/stops', stopRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);
router.use('/operators', operatorRoutes);
router.use('/reports', reportRoutes);
router.use('/users', userRoutes);
router.use('/audit-logs', auditLogRoutes);

module.exports = router;
