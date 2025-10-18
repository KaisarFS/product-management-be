const axios = require('axios');
const config = require('../config');

async function verifyCaptcha(responseToken, remoteIp) {
  if (!responseToken) {
    return { success: false, message: 'Captcha token is required.' };
  }

  const { secret, verifyUrl, provider } = config.captcha;

  if (!secret || !verifyUrl) {
    return {
      success: false,
      message: 'Captcha configuration is missing on the server.',
    };
  }

  try {
    const payload = new URLSearchParams({
      secret,
      response: responseToken,
    });

    if (remoteIp) {
      payload.append('remoteip', remoteIp);
    }

    const { data } = await axios.post(verifyUrl, payload.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const isValid = Boolean(
      data.success &&
        (provider !== 'recaptcha' ||
          typeof data.score !== 'number' ||
          data.score >= Number(process.env.RECAPTCHA_MIN_SCORE || 0.5))
    );

    if (!isValid) {
      return {
        success: false,
        message: 'Captcha validation failed.',
        raw: data,
      };
    }

    return { success: true, raw: data };
  } catch (error) {
    return {
      success: false,
      message: 'Captcha verification error.',
      error,
    };
  }
}

module.exports = {
  verifyCaptcha,
};

