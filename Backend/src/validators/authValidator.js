import { body } from 'express-validator';

export const sendOtpValidator = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Mobile phone number is required')
    .isLength({ min: 8, max: 20 })
    .withMessage('Please provide a valid phone number with country code'),
];

export const verifyOtpValidator = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP code is required')
    .isNumeric()
    .withMessage('OTP must consist of numbers only')
    .isLength({ min: 4, max: 8 })
    .withMessage('OTP must be between 4 and 8 digits'),
];
