const { body } = require('express-validator');

const busTypes = ['AC Sleeper', 'AC Seater', 'Non-AC Sleeper', 'Non-AC Seater', 'Volvo', 'Mini'];

const createBusValidator = [
  body('busNumber')
    .trim()
    .notEmpty()
    .withMessage('Bus number is required'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Bus name is required'),
  body('type')
    .notEmpty()
    .withMessage('Bus type is required')
    .isIn(busTypes)
    .withMessage(`Type must be one of: ${busTypes.join(', ')}`),
  body('totalSeats')
    .isInt({ min: 1 })
    .withMessage('Total seats must be a positive integer'),
  body('seatLayout.rows')
    .isInt({ min: 1 })
    .withMessage('Seat layout rows must be an integer >= 1'),
  body('seatLayout.seatsPerRow')
    .isInt({ min: 1 })
    .withMessage('Seats per row must be an integer >= 1'),
  body('seatLayout.layout')
    .optional()
    .isArray()
    .withMessage('Seat layout must be an array'),
  body('operator')
    .optional()
    .isMongoId()
    .withMessage('Operator must be a valid Mongo ID'),
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array of strings'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

const updateBusValidator = [
  body('busNumber')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Bus number cannot be empty'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Bus name cannot be empty'),
  body('type')
    .optional()
    .isIn(busTypes)
    .withMessage(`Type must be one of: ${busTypes.join(', ')}`),
  body('totalSeats')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total seats must be a positive integer'),
  body('seatLayout.rows')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Seat layout rows must be an integer >= 1'),
  body('seatLayout.seatsPerRow')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Seats per row must be an integer >= 1'),
  body('seatLayout.layout')
    .optional()
    .isArray()
    .withMessage('Seat layout must be an array'),
  body('operator')
    .optional()
    .isMongoId()
    .withMessage('Operator must be a valid Mongo ID'),
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

module.exports = {
  createBusValidator,
  updateBusValidator
};
