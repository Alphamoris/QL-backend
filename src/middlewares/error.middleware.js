const mongoose = require('mongoose');
const {
  handleCastErrorDB,
  handleDuplicateFieldsDB,
  handleValidationErrorDB,
  handleJWTError,
  handleJWTExpiredError,
  sendErrorDev,
  sendErrorProd,
} = require('../utils/errorHandler');
const { AppError } = require('../utils/errorHandler');
const config = require('../config/config');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.server.nodeEnv === 'development') {
    sendErrorDev(err, res);
  } else if (config.server.nodeEnv === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err instanceof mongoose.Error.CastError) error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err instanceof mongoose.Error.ValidationError) error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
}; 