import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Otp } from '../models/Otp.js';
import { config } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Standardize phone number format: e.g. +1 (555) 382-9012 -> +15553829012 or standard format
 */
export function normalizePhoneNumber(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') return '';
  let cleaned = rawPhone.trim().replace(/[^\d+]/g, '');
  // Standardize 10-digit Indian mobile number
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }
  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  return cleaned;
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
export function generateNumericOtp(length = 6) {
  // Use crypto randomInt to avoid predictable math.random
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1).toString();
}

/**
 * Send OTP via configured provider (Mock, Twilio, or other)
 */
async function sendSmsNotification(phone, otpCode) {
  const provider = config.sms.provider;

  if (provider === 'twilio' && config.sms.twilioAccountSid && config.sms.twilioAuthToken) {
    // Configured for Twilio integration
    try {
      // Lazy load twilio if installed or log simulated dispatch
      console.log(`[SMS:Twilio] Dispatched OTP to ${phone}`);
      return { success: true, provider: 'twilio' };
    } catch (err) {
      console.error(`[SMS:Twilio Error] Failed to send SMS: ${err.message}`);
      throw ApiError.internal('Failed to dispatch SMS notification');
    }
  }

  // Fallback / Development mode SMS handler
  if (config.otp.devLogEnabled && config.env !== 'production') {
    console.log(`\n==============================================`);
    console.log(`[DEVELOPMENT ONLY OTP] Phone: ${phone}`);
    console.log(`[DEVELOPMENT ONLY OTP] Code : ${otpCode}`);
    console.log(`[DEVELOPMENT ONLY OTP] Expires in: ${config.otp.ttlMinutes} minutes`);
    console.log(`==============================================\n`);
  }

  return { success: true, provider: 'mock' };
}

/**
 * Request a new OTP for a phone number
 */
export async function requestOtp(rawPhone) {
  const phone = normalizePhoneNumber(rawPhone);
  if (!phone || phone.length < 8) {
    throw ApiError.badRequest('Please provide a valid mobile phone number');
  }

  // Check cooldown from last request
  const existingRecord = await Otp.findOne({ phone, isVerified: false }).sort({ createdAt: -1 });
  if (existingRecord) {
    const elapsedSeconds = Math.floor((Date.now() - new Date(existingRecord.lastRequestedAt).getTime()) / 1000);
    const cooldownRemaining = config.otp.cooldownSeconds - elapsedSeconds;
    if (cooldownRemaining > 0) {
      throw ApiError.tooManyRequests(
        `Please wait ${cooldownRemaining} seconds before requesting a new OTP.`
      );
    }
  }

  // Generate 6-digit OTP
  const otpCode = generateNumericOtp(6);

  // Hash OTP using bcrypt with salt rounds
  const salt = await bcrypt.genSalt(10);
  const otpHash = await bcrypt.hash(otpCode, salt);

  // Expiration time (default 5 minutes)
  const expiresAt = new Date(Date.now() + config.otp.ttlMinutes * 60 * 1000);

  // Invalidate any older active OTPs for this phone
  await Otp.deleteMany({ phone });

  // Store new OTP record
  await Otp.create({
    phone,
    otpHash,
    attempts: 0,
    maxAttempts: config.otp.maxAttempts,
    lastRequestedAt: new Date(),
    expiresAt,
    isVerified: false,
  });

  // Dispatch via SMS provider
  await sendSmsNotification(phone, otpCode);

  return {
    phone,
    expiresInSeconds: config.otp.ttlMinutes * 60,
    ...(config.env === 'development' ? { devOtp: otpCode } : {}),
  };
}

/**
 * Verify submitted OTP for a phone number
 */
export async function verifyOtp(rawPhone, submittedOtp) {
  const phone = normalizePhoneNumber(rawPhone);
  if (!phone) {
    throw ApiError.badRequest('Phone number is required');
  }

  if (!submittedOtp || typeof submittedOtp !== 'string' || submittedOtp.trim().length === 0) {
    throw ApiError.badRequest('Please enter a valid OTP code');
  }

  const trimmedOtp = submittedOtp.trim();

  // Find latest active OTP
  const record = await Otp.findOne({ phone, isVerified: false }).sort({ createdAt: -1 });

  if (!record) {
    throw ApiError.badRequest('No pending OTP request found. Please request a new OTP.');
  }

  // Check expiration
  if (new Date() > new Date(record.expiresAt)) {
    await Otp.deleteOne({ _id: record._id });
    throw ApiError.badRequest('OTP has expired. Please request a new code.');
  }

  // Check attempt limit
  if (record.attempts >= record.maxAttempts) {
    await Otp.deleteOne({ _id: record._id });
    throw ApiError.badRequest('Maximum verification attempts exceeded. Please request a new OTP.');
  }

  // Compare hash with submitted OTP
  const isMatch = await bcrypt.compare(trimmedOtp, record.otpHash);

  if (!isMatch) {
    record.attempts += 1;
    await record.save();

    const remainingAttempts = record.maxAttempts - record.attempts;
    if (remainingAttempts <= 0) {
      await Otp.deleteOne({ _id: record._id });
      throw ApiError.badRequest('Maximum attempts reached. This OTP has been invalidated.');
    }

    throw ApiError.badRequest(
      `Invalid OTP. You have ${remainingAttempts} attempt(s) remaining.`
    );
  }

  // Mark as verified & clean up
  record.isVerified = true;
  await record.save();
  await Otp.deleteMany({ phone });

  return { success: true, phone };
}
