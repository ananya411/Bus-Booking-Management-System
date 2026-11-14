require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const { connectDB } = require('./src/config/db');
const swaggerSpec = require('./src/config/swagger');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const { errorResponse } = require('./src/utils/response');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// CORS Configuration (Production on Render + Netlify Support)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(',').forEach((url) => {
    const trimmed = url.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman, health monitors)
      if (!origin) return callback(null, true);

      // Always allow local development
      if (process.env.NODE_ENV === 'development') return callback(null, true);

      // Explicit origin match
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);

      // Netlify domains and deploy previews (*.netlify.app)
      if (/^https:\/\/([a-zA-Z0-9-]+)\.netlify\.app$/.test(origin)) {
        return callback(null, true);
      }

      // Universal wildcard override if explicitly configured
      if (process.env.CORS_ORIGIN === '*' || process.env.CORS_ORIGIN === origin) {
        return callback(null, true);
      }

      return callback(new Error('CORS not allowed from this origin: ' + origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root Endpoint (For Render ping & status check)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BusMitra Bus Booking Management System API is live and operational',
    docs: '/api/docs',
    health: '/api/health',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Swagger Documentation UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// API Root Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    },
    message: 'Bus Booking Management System API is healthy'
  });
});

// Mount All API Routes
app.use('/api', routes);

// 404 Route Not Found Handler
app.use((req, res) => {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
});

// Centralized Global Error Handler
app.use(errorHandler);

// Start Server
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Bus Booking API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`[Docs] Swagger UI available at http://localhost:${PORT}/api/docs`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Server] Unhandled Rejection: ${err.message}`);
});

module.exports = { app, server };
