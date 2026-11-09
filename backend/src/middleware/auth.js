const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { errorResponse } = require('../utils/response');

/**
 * Authentication Middleware
 * Validates JWT token from Authorization header and attaches User to req.user
 */
const authenticate = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Authentication token is required. Please log in.', 401);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bus_booking_jwt_super_secret_key_2024_secure!');
      const user = await User.findById(decoded.id);

      if (!user) {
        return errorResponse(res, 'User belonging to this token no longer exists.', 401);
      }

      req.user = user;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token has expired. Please log in again.', 401);
      }
      return errorResponse(res, 'Invalid token. Please log in again.', 401);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
