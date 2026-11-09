const { body } = require('express-validator');

const createStopValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Stop name is required'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
];

module.exports = {
  createStopValidator
};
