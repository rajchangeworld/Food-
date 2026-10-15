import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/User.js';

export function signToken(payload) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('Authentication token missing or invalid'));
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(ApiError.unauthorized('Token has expired. Please log in again.'));
      }
      return next(ApiError.unauthorized('Invalid authentication token'));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(ApiError.unauthorized('User associated with this token no longer exists'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication: attaches req.user if a valid token is present,
 * but allows unauthenticated requests to proceed.
 */
export async function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
        }
      } catch {
        // Silently ignore invalid token in optional mode
      }
    }
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(ApiError.forbidden('Admin authorization required for this action'));
  }
  next();
}
