const dotenv = require('dotenv');

dotenv.config();

const requiredEnv = ['JWT_SECRET', 'DATABASE_URL', 'CAPTCHA_SECRET_KEY'];

const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  // eslint-disable-next-line no-console
  console.warn(
    `Warning: Missing environment variables: ${missing.join(
      ', '
    )}. Some features may not work as expected.`
  );
}

const captchaProvider = process.env.CAPTCHA_PROVIDER || 'recaptcha';

const captchaVerifyUrls = {
  recaptcha: 'https://www.google.com/recaptcha/api/siteverify',
  hcaptcha: 'https://hcaptcha.com/siteverify',
};

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  jwtExpiration: process.env.JWT_EXPIRATION || '1h',
  databaseUrl: process.env.DATABASE_URL,
  dbSsl:
    typeof process.env.DATABASE_SSL === 'string'
      ? process.env.DATABASE_SSL === 'true'
      : process.env.NODE_ENV === 'production',
  captcha: {
    provider: captchaProvider,
    secret: process.env.CAPTCHA_SECRET_KEY,
    verifyUrl: process.env.CAPTCHA_VERIFY_URL || captchaVerifyUrls[captchaProvider],
  },
};

