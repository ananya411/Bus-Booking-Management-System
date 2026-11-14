const { body } = require('express-validator');

const createBookingValidator = [
  body('tripId')
    .custom((value, { req }) => {
      const tripId = value || req.body.trip_id;
      if (!tripId) {
        throw new Error('Trip ID is required');
      }
      if (!/^[0-9a-fA-F]{24}$/.test(tripId.toString())) {
        throw new Error('Invalid Trip ID format');
      }
      return true;
    }),
  body('passengers')
    .isArray({ min: 1 })
    .withMessage('Passengers must be a non-empty array'),
  body('passengers.*.name')
    .trim()
    .notEmpty()
    .withMessage('Passenger name is required'),
  body('passengers.*.age')
    .custom((value) => {
      const age = parseInt(value, 10);
      if (isNaN(age) || age < 1 || age > 120) {
        throw new Error('Passenger age must be a valid number between 1 and 120');
      }
      return true;
    }),
  body('passengers.*.gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('passengers.*')
    .custom((passenger) => {
      const seat = passenger.seatNumber || passenger.seat_number;
      if (!seat || !seat.toString().trim()) {
        throw new Error('Passenger seatNumber is required');
      }
      return true;
    }),
  body('boardingPoint')
    .optional()
    .custom((val) => {
      if (val && !/^[0-9a-fA-F]{24}$/.test(val.toString())) {
        return true; // allow string stop names or omit
      }
      return true;
    }),
  body('droppingPoint')
    .optional()
    .custom((val) => {
      if (val && !/^[0-9a-fA-F]{24}$/.test(val.toString())) {
        return true; // allow string stop names or omit
      }
      return true;
    }),
];

module.exports = {
  createBookingValidator,
};
