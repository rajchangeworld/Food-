import express from 'express';
import { sendOtp, verifyOtpHandler, getMe, logout } from '../controllers/authController.js';
import { sendOtpValidator, verifyOtpValidator } from '../validators/authValidator.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { otpRequestLimiter, otpVerifyLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/send-otp', otpRequestLimiter, sendOtpValidator, validate, sendOtp);
router.post('/verify-otp', otpVerifyLimiter, verifyOtpValidator, validate, verifyOtpHandler);
router.get('/me', authenticate, getMe);
router.post('/logout', logout);

export default router;
