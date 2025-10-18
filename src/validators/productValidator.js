const { body, param } = require('express-validator');

const numericIdParam = [
  param('id').isInt({ min: 1 }).withMessage('Product id must be a positive integer.'),
];

const baseProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required.'),
  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be a string.'),
  body('price')
    .notEmpty()
    .withMessage('Price is required.')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number.')
    .toFloat(),
  body('imageUrl')
    .optional({ nullable: true })
    .isString()
    .withMessage('imageUrl must be a string.')
    .trim(),
  body('latitude')
    .optional({ nullable: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90.')
    .toFloat(),
  body('longitude')
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180.')
    .toFloat(),
];

const createProductValidator = [...baseProductValidation];

const updateProductValidator = [...numericIdParam, ...baseProductValidation];

const deleteProductValidator = [...numericIdParam];

module.exports = {
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
};

