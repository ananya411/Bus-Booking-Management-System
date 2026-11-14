const { body } = require('express-validator');

const busTypes = ['AC Sleeper', 'AC Seater', 'Non-AC Sleeper', 'Non-AC Seater', 'Volvo', 'Mini'];

const normalizeBusInput = (val, { req }) => {
  req.body.busNumber = (req.body.busNumber || req.body.bus_number || '').trim().toUpperCase();
  req.body.name = (req.body.name || req.body.bus_name || '').trim();

  let typeVal = req.body.type || req.body.bus_type || 'Volvo';
  if (typeVal.toLowerCase().includes('non-ac') && typeVal.toLowerCase().includes('sleeper')) typeVal = 'Non-AC Sleeper';
  else if (typeVal.toLowerCase().includes('non-ac') && typeVal.toLowerCase().includes('seater')) typeVal = 'Non-AC Seater';
  else if (typeVal.toLowerCase().includes('sleeper')) typeVal = 'AC Sleeper';
  else if (typeVal.toLowerCase().includes('seater')) typeVal = 'AC Seater';
  else if (typeVal.toLowerCase().includes('mini')) typeVal = 'Mini';
  else if (!busTypes.includes(typeVal)) typeVal = 'Volvo';
  req.body.type = typeVal;

  req.body.totalSeats = Number(req.body.totalSeats || req.body.total_seats || 36);
  if (!req.body.seatLayout || !req.body.seatLayout.rows) {
    const seatsPerRow = 4;
    const rows = Math.ceil(req.body.totalSeats / seatsPerRow);
    req.body.seatLayout = { rows, seatsPerRow, layout: [] };
  }
  return true;
};

const createBusValidator = [
  body('busNumber').custom(normalizeBusInput),
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
