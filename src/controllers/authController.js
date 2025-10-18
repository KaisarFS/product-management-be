const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const config = require('../config');
const { verifyCaptcha } = require('../services/captchaService');

async function login(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Invalid request data.',
      errors: errors.array(),
    });
  }

  const { username, password, captchaToken } = req.body;

  try {
    const captchaResult = await verifyCaptcha(captchaToken, req.ip);
    if (!captchaResult.success) {
      return res.status(400).json({
        message: captchaResult.message,
      });
    }

    const { rows } = await pool.query(
      'SELECT id, username, password_hash FROM users WHERE username = $1 LIMIT 1',
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiration,
      }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};

