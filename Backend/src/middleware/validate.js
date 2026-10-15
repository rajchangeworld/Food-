import { validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));
    return next(ApiError.badRequest('Validation failed', formatted));
  }
  next();
}
