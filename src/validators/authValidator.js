const { body } = require('express-validator');

const loginValidator = [
  body('username').trim().notEmpty().withMessage('Username is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
  body('captchaToken').notEmpty().withMessage('Captcha token is required.'),
];

module.exports = {
  loginValidator,
};

