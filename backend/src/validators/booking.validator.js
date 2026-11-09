const { body } = require('express-validator');

const createBookingValidator = [
  body('tripId')
    .notEmpty()
    .withMessage('Trip ID is required')
    .isMongoId()
    .withMessage('Invalid Trip ID format'),
  body('passengers')
    .isArray({ min: 1 })
    .withMessage('Passengers must be a non-empty array'),
  body('passengers.*.name')
    .trim()
    .notEmpty()
    .withMessage('Passenger name is required'),
  body('passengers.*.age')
    .isInt({ min: 1, max: 120 })
    .withMessage('Passenger age must be a valid number between 1 and 120'),
  body('passengers.*.gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('passengers.*.seatNumber')
    .trim()
    .notEmpty()
    .withMessage('Passenger seatNumber is required'),
  body('boardingPoint')
    .optional()
    .isMongoId()
    .withMessage('Boarding point must be a valid Mongo ID'),
  body('droppingPoint')
    .optional()
    .isMongoId()
    .withMessage('Dropping point must be a valid Mongo ID')
];

module.exports = {
  createBookingValidator
};
