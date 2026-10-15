import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

// General API rate limiter (100 requests per 15 minutes)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.env === 'test' ? 10000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  skip: () => config.env === 'test',
});

// Stricter rate limiter for OTP requests (5 per 15 minutes per IP)
export const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.env === 'test' ? 10000 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests from this IP. Please try again later.',
  },
  skip: () => config.env === 'test',
});

// Stricter rate limiter for OTP verifications (10 attempts per 15 minutes per IP)
export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.env === 'test' ? 10000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many verification attempts from this IP. Please try again later.',
  },
  skip: () => config.env === 'test',
});
