const { errorResponse } = require('../utils/response');

/**
 * Authorization Middleware Factory
 * Checks if authenticated user has one of the allowed roles
 * @param  {...string} roles Allowed roles (e.g. 'admin', 'operator', 'customer')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required before checking permissions.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Role '${req.user.role}' is not authorized to access this resource. Required: [${roles.join(', ')}]`,
        403
      );
    }

    next();
  };
};

module.exports = authorize;
