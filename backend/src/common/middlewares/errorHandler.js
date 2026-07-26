import { AppError } from '../errors/AppError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  logger.error(`[Error] Path: ${req.originalUrl} | Method: ${req.method} | Message: ${err.message}`, {
    stack: err.stack,
  });

  // Mongoose CastError (Invalid ID)
  if (err.name === 'CastError') {
    const message = `Invalid resource identifier: ${err.value}`;
    return ApiResponse.error(res, message, 400);
  }

  // Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const keys = Object.keys(err.keyValue || {});
    const message = `Duplicate field value entered for: ${keys.join(', ')}`;
    return ApiResponse.error(res, message, 409);
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message);
    return ApiResponse.error(res, 'Validation error', 400, errors);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 'Invalid authentication token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 'Authentication token has expired', 401);
  }

  if (err instanceof AppError || err.isOperational) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors);
  }

  // Internal Programmer / Server Error
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  return ApiResponse.error(res, message, 500);
};
