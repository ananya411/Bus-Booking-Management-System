const { body } = require('express-validator');

const tripStatuses = ['scheduled', 'in-progress', 'completed', 'cancelled'];

const normalizeTripInput = (val, { req }) => {
  req.body.bus = req.body.bus || req.body.bus_id;
  req.body.route = req.body.route || req.body.route_id;
  req.body.travelDate = req.body.travelDate || req.body.trip_date;
  req.body.departureTime = req.body.departureTime || req.body.departure_time;
  req.body.arrivalTime = req.body.arrivalTime || req.body.arrival_time;
  return true;
};

const createTripValidator = [
  body('bus').custom(normalizeTripInput),
  body('bus')
    .notEmpty()
    .withMessage('Bus is required')
    .isMongoId()
    .withMessage('Invalid Bus ID'),
  body('route')
    .notEmpty()
    .withMessage('Route is required')
    .isMongoId()
    .withMessage('Invalid Route ID'),
  body('operator')
    .optional()
    .isMongoId()
    .withMessage('Invalid Operator ID'),
  body('travelDate')
    .notEmpty()
    .withMessage('Travel date is required')
    .isISO8601()
    .withMessage('Travel date must be a valid ISO 8601 date'),
  body('departureTime')
    .trim()
    .notEmpty()
    .withMessage('Departure time is required'),
  body('arrivalTime')
    .trim()
    .notEmpty()
    .withMessage('Arrival time is required'),
  body('fare')
    .notEmpty()
    .withMessage('Fare is required')
    .isFloat({ min: 0 })
    .withMessage('Fare must be a non-negative number'),
  body('boardingPoints')
    .optional()
    .isArray()
    .withMessage('Boarding points must be an array'),
  body('droppingPoints')
    .optional()
    .isArray()
    .withMessage('Dropping points must be an array'),
  body('status')
    .optional()
    .isIn(tripStatuses)
    .withMessage(`Status must be one of: ${tripStatuses.join(', ')}`),
  body('availableSeats')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available seats must be a non-negative integer')
];

const updateTripValidator = [
  body('bus')
    .optional()
    .isMongoId()
    .withMessage('Invalid Bus ID'),
  body('route')
    .optional()
    .isMongoId()
    .withMessage('Invalid Route ID'),
  body('operator')
    .optional()
    .isMongoId()
    .withMessage('Invalid Operator ID'),
  body('travelDate')
    .optional()
    .isISO8601()
    .withMessage('Travel date must be a valid ISO 8601 date'),
  body('departureTime')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Departure time cannot be empty'),
  body('arrivalTime')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Arrival time cannot be empty'),
  body('fare')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fare must be a non-negative number'),
  body('boardingPoints')
    .optional()
    .isArray()
    .withMessage('Boarding points must be an array'),
  body('droppingPoints')
    .optional()
    .isArray()
    .withMessage('Dropping points must be an array'),
  body('status')
    .optional()
    .isIn(tripStatuses)
    .withMessage(`Status must be one of: ${tripStatuses.join(', ')}`),
  body('availableSeats')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available seats must be a non-negative integer')
];

module.exports = {
  createTripValidator,
  updateTripValidator
};
