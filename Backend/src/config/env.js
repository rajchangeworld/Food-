import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_delivery',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  otp: {
    mode: process.env.OTP_MODE || 'development',
    ttlMinutes: parseInt(process.env.OTP_TTL_MINUTES, 10) || 5,
    devLogEnabled: process.env.OTP_DEV_LOG_ENABLED === 'true',
    maxAttempts: parseInt(process.env.MAX_OTP_ATTEMPTS, 10) || 3,
    cooldownSeconds: parseInt(process.env.OTP_COOLDOWN_SECONDS, 10) || 60,
  },
  simulation: {
    enabled: process.env.SIMULATE_ORDER_STATUS === 'true',
    intervalMs: parseInt(process.env.SIMULATION_INTERVAL_MS, 10) || 8000,
  },
  sms: {
    provider: process.env.SMS_PROVIDER || 'mock',
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },
};
