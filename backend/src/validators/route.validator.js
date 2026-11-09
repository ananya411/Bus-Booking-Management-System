const { body } = require('express-validator');

const createRouteValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Route name is required'),
  body('source')
    .notEmpty()
    .withMessage('Source stop is required')
    .isMongoId()
    .withMessage('Invalid Source Stop ID'),
  body('destination')
    .notEmpty()
    .withMessage('Destination stop is required')
    .isMongoId()
    .withMessage('Invalid Destination Stop ID'),
  body('stops')
    .optional()
    .isArray()
    .withMessage('Intermediate stops must be an array'),
  body('totalDistance')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total distance must be non-negative'),
  body('estimatedDuration')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated duration must be non-negative')
];

const updateRouteValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Route name cannot be empty'),
  body('source')
    .optional()
    .isMongoId()
    .withMessage('Invalid Source Stop ID'),
  body('destination')
    .optional()
    .isMongoId()
    .withMessage('Invalid Destination Stop ID'),
  body('stops')
    .optional()
    .isArray()
    .withMessage('Intermediate stops must be an array'),
  body('totalDistance')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total distance must be non-negative'),
  body('estimatedDuration')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated duration must be non-negative')
];

module.exports = {
  createRouteValidator,
  updateRouteValidator
};
