import { describe, it, expect } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/app.js';
import { Otp } from '../src/models/Otp.js';
import { User } from '../src/models/User.js';

describe('Authentication & OTP API (/api/auth)', () => {
  const validPhone = '+15551234567';

  it('should request an OTP with a valid phone number', async () => {
    const res = await request(app)
      .post('/api/auth/send-otp')
      .send({ phone: validPhone });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('OTP sent successfully');
    expect(res.body.phone).toBe(validPhone);
    // Never expose plain OTP in response
    expect(res.body.otp).toBeUndefined();

    // Verify OTP was stored in DB as a bcrypt hash
    const record = await Otp.findOne({ phone: validPhone });
    expect(record).not.toBeNull();
    expect(record.otpHash).toMatch(/^\$2[aby]\$/); // Valid bcrypt hash prefix
  });

  it('should reject invalid or missing phone numbers', async () => {
    const res = await request(app)
      .post('/api/auth/send-otp')
      .send({ phone: '123' }); // too short

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject incorrect OTPs and increment attempts', async () => {
    // Request OTP first
    await request(app)
      .post('/api/auth/send-otp')
      .send({ phone: validPhone });

    // Submit invalid OTP
    const res = await request(app)
      .post('/api/auth/verify-otp')
      .send({ phone: validPhone, otp: '000000' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid OTP');

    // Attempt counter incremented in DB
    const record = await Otp.findOne({ phone: validPhone });
    expect(record.attempts).toBe(1);
  });

  it('should reject repeated OTP attempts after max attempt limit is reached', async () => {
    // Request OTP
    await request(app)
      .post('/api/auth/send-otp')
      .send({ phone: validPhone });

    // 3 wrong attempts (maxAttempts = 3)
    await request(app).post('/api/auth/verify-otp').send({ phone: validPhone, otp: '111111' });
    await request(app).post('/api/auth/verify-otp').send({ phone: validPhone, otp: '222222' });
    const finalRes = await request(app).post('/api/auth/verify-otp').send({ phone: validPhone, otp: '333333' });

    expect(finalRes.status).toBe(400);
    expect(finalRes.body.message).toContain('Maximum');

    // OTP record should now be invalidated / removed
    const record = await Otp.findOne({ phone: validPhone });
    expect(record).toBeNull();
  });

  it('should reject expired OTPs', async () => {
    const hash = await bcrypt.hash('999999', 10);
    // Create an expired OTP in database
    await Otp.create({
      phone: validPhone,
      otpHash: hash,
      attempts: 0,
      maxAttempts: 3,
      expiresAt: new Date(Date.now() - 10000), // In the past
    });

    const res = await request(app)
      .post('/api/auth/verify-otp')
      .send({ phone: validPhone, otp: '999999' });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('expired');
  });

  it('should verify correct OTP, create user, and return JWT token', async () => {
    const testOtp = '789123';
    const hash = await bcrypt.hash(testOtp, 10);

    await Otp.create({
      phone: validPhone,
      otpHash: hash,
      attempts: 0,
      maxAttempts: 3,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const res = await request(app)
      .post('/api/auth/verify-otp')
      .send({ phone: validPhone, otp: testOtp });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.phone).toBe(validPhone);

    // Verify user was persisted
    const savedUser = await User.findOne({ phone: validPhone });
    expect(savedUser).not.toBeNull();

    // Verify OTP was cleaned up after successful verification
    const otpDoc = await Otp.findOne({ phone: validPhone });
    expect(otpDoc).toBeNull();
  });

  it('should reject protected endpoints if token is missing or invalid', async () => {
    // Missing token
    const resNoAuth = await request(app).get('/api/auth/me');
    expect(resNoAuth.status).toBe(401);
    expect(resNoAuth.body.message).toContain('token missing');

    // Invalid token
    const resBadToken = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid_token_123');
    expect(resBadToken.status).toBe(401);
  });

  it('should return authenticated user profile from /api/auth/me', async () => {
    // Create user and simulate login
    const testOtp = '123456';
    const hash = await bcrypt.hash(testOtp, 10);
    await Otp.create({
      phone: validPhone,
      otpHash: hash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const loginRes = await request(app)
      .post('/api/auth/verify-otp')
      .send({ phone: validPhone, otp: testOtp });

    const token = loginRes.body.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.user.phone).toBe(validPhone);
  });
});
