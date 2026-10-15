import { ApiError } from '../utils/apiError.js';
import { config } from '../config/env.js';

export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Endpoint not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  let error = err;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Invalid identifier format for ${err.path}: ${err.value}`;
    error = ApiError.badRequest(message);
  }

  // Handle Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate value entered for ${field}. Value already exists.`;
    error = ApiError.conflict(message);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest('Validation error', errors);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid authentication token');
  }
  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Authentication token has expired');
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Only log detailed stack in dev/test, not in production
  if (config.env !== 'test') {
    if (statusCode >= 500) {
      console.error(`[Server Error] ${err.stack || err.message}`);
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(error.errors && error.errors.length > 0 ? { errors: error.errors } : {}),
    ...(config.env === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
  });
}
