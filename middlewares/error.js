const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('../config/config.js');
const ApiError = require('../untils/ApiError.js');
const logger = require('../config/logger.js');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, error.stack);
  }
  next(error);
};
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[statusCode];
  }
  const response = {
    error: true,
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };
  res.locals.errorMessage = message;
  if (config.env === 'development') {
    logger.error(err);
  }
  res.status(statusCode).send(response);
};

module.exports = { errorHandler, errorConverter };
