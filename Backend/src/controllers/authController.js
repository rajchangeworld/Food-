import { requestOtp, verifyOtp, normalizePhoneNumber } from '../services/otpService.js';
import { User } from '../models/User.js';
import { signToken } from '../middleware/auth.js';
import { config } from '../config/env.js';

export async function sendOtp(req, res, next) {
  try {
    const { phone } = req.body;
    const result = await requestOtp(phone);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your mobile number',
      phone: result.phone,
      expiresInSeconds: result.expiresInSeconds,
      mode: config.otp.mode,
      ...(result.devOtp ? { devOtp: result.devOtp } : {}),
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyOtpHandler(req, res, next) {
  try {
    const { phone, otp } = req.body;
    await verifyOtp(phone, otp);

    const normalizedPhone = normalizePhoneNumber(phone);

    // Find or create user
    let user = await User.findOne({ phone: normalizedPhone });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        phone: normalizedPhone,
        name: 'Foodie Guest',
        email: '',
        role: 'customer',
        addresses: [],
      });
      isNewUser = true;
    }

    // Sign JWT token
    const token = signToken({
      id: user._id.toString(),
      phone: user.phone,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: isNewUser ? 'Account created and verified successfully' : 'Login successful',
      token,
      isNewUser,
      user: {
        id: user._id.toString(),
        phone: user.phone,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        addresses: user.addresses,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        phone: user.phone,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        addresses: user.addresses,
        preferences: user.preferences,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res) {
  // With stateless JWT, client deletes token. Acknowledge logout cleanly.
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
}
