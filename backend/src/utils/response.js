/**
 * Standardized API Response Utilities
 * Base structure: { success: bool, data: any, message: string, pagination?: {...} }
 */

const successResponse = (res, data = null, message = 'Success', statusCode = 200, pagination = undefined) => {
  const response = {
    success: true,
    data,
    message
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = undefined) => {
  const response = {
    success: false,
    data: null,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse
};
