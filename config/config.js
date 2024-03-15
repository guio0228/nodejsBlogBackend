require('dotenv').config();
const logger = require('./logger');
const { envValidation } = require('../validations');

const { error, value: envVars } = envValidation.validate(process.env);

if (error) {
  logger.error(error);
}

// 使用 value 中的值继续应用程序的初始化和运行
module.exports = {
  port: envVars.PORT,
  dbConnection: envVars.DB_CONNECTION,
  env: envVars.NODE_ENV, // development
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
  rateLimiter: {
    maxAttemptsPerDay: envVars.MAX_ATTEMPTS_PER_DAY,
    maxAttemptsByIpUsername: envVars.MAX_ATTEMPTS_BY_IP_USERNAME,
    maxAttemptsPerEmail: envVars.MAX_ATTEMPTS_PER_EMAIL,
  },
  cspOptions: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
    },
  },
};
