const express = require('express');
const { login } = require('../controllers/authController');
const { loginValidator } = require('../validators/authValidator');

const router = express.Router();

router.post('/login', loginValidator, login);

module.exports = router;

