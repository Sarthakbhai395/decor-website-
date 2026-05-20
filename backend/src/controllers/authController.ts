import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Notification from '../models/Notification';
import { AuthRequest } from '../types';
import {
  sendSuccess,
  sendCreated,
  sendError,
  sendBadRequest,
  sendUnauthorized,
  sendNotFound,
} from '../utils/apiResponse';
import {
  sendOTPEmail,
  sendPasswordResetEmail,
  sendEmail,
} from '../utils/email';
import { generateOTP, generateToken, hashToken } from '../utils/helpers';
import logger from '../utils/logger';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

const setTokenCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  res.cookie('accessToken', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie('refreshToken', refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ─── Register ─────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      sendBadRequest(res, 'An account with this email already exists');
      return;
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + Number(process.env.OTP_EXPIRES_IN || 600000));

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      otp,
      otpExpiry,
    });

    await sendOTPEmail(email, otp, name);

    sendCreated(res, 'Account created. Please verify your email with the OTP sent.', {
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    logger.error(`Register error: ${error}`);
    sendError(res, 'Registration failed', 500, String(error));
  }
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpiry');
    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    if (user.isVerified) {
      sendBadRequest(res, 'Email already verified');
      return;
    }

    if (!user.otp || user.otp !== otp) {
      sendBadRequest(res, 'Invalid OTP');
      return;
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      sendBadRequest(res, 'OTP has expired. Please request a new one.');
      return;
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Create welcome notification
    await Notification.create({
      user: user._id,
      title: 'Welcome to Luxe Celebrations! ✨',
      message: 'Your account has been verified. Start exploring our luxury experiences.',
      type: 'system',
      link: '/services',
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    setTokenCookies(res, accessToken, refreshToken);

    sendSuccess(res, 'Email verified successfully. Welcome to Luxe Celebrations!', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
    });
  } catch (error) {
    logger.error(`Verify OTP error: ${error}`);
    sendError(res, 'OTP verification failed', 500, String(error));
  }
};

// ─── Resend OTP ───────────────────────────────────────────────────────────────
export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpiry');
    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    if (user.isVerified) {
      sendBadRequest(res, 'Email already verified');
      return;
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + Number(process.env.OTP_EXPIRES_IN || 600000));
    await user.save();

    await sendOTPEmail(email, otp, user.name);
    sendSuccess(res, 'OTP resent successfully');
  } catch (error) {
    sendError(res, 'Failed to resend OTP', 500, String(error));
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshToken');
    if (!user) {
      sendUnauthorized(res, 'Invalid email or password');
      return;
    }

    if (!user.isActive) {
      sendUnauthorized(res, 'Your account has been deactivated. Contact support.');
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      sendUnauthorized(res, 'Invalid email or password');
      return;
    }

    if (!user.isVerified) {
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + Number(process.env.OTP_EXPIRES_IN || 600000));
      await user.save();
      await sendOTPEmail(email, otp, user.name);

      res.status(403).json({
        success: false,
        message: 'Email not verified. A new OTP has been sent.',
        requiresVerification: true,
        email: user.email,
      });
      return;
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    setTokenCookies(res, accessToken, refreshToken);

    sendSuccess(res, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
      accessToken,
    });
  } catch (error) {
    logger.error(`Login error: ${error}`);
    sendError(res, 'Login failed', 500, String(error));
  }
};

// ─── Refresh Token ────────────────────────────────────────────────────────────
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;

    if (!token) {
      sendUnauthorized(res, 'Refresh token required');
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      sendUnauthorized(res, 'Invalid refresh token');
      return;
    }

    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();
    user.refreshToken = newRefreshToken;
    await user.save();

    setTokenCookies(res, accessToken, newRefreshToken);
    sendSuccess(res, 'Token refreshed', { accessToken });
  } catch (error) {
    sendUnauthorized(res, 'Invalid or expired refresh token');
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: undefined });
    }

    res.clearCookie('accessToken', COOKIE_OPTIONS);
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    sendSuccess(res, 'Logged out successfully');
  } catch (error) {
    sendError(res, 'Logout failed', 500, String(error));
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Security: don't reveal if email exists
      sendSuccess(res, 'If an account exists with this email, a reset link has been sent.');
      return;
    }

    const resetToken = generateToken();
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, user.name, resetToken);
    sendSuccess(res, 'Password reset link sent to your email');
  } catch (error) {
    sendError(res, 'Failed to send reset email', 500, String(error));
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    const hashedToken = hashToken(token);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiry: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpiry');

    if (!user) {
      sendBadRequest(res, 'Invalid or expired reset token');
      return;
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    user.refreshToken = undefined;
    await user.save();

    res.clearCookie('accessToken', COOKIE_OPTIONS);
    res.clearCookie('refreshToken', COOKIE_OPTIONS);

    await sendEmail({
      to: user.email,
      subject: 'Password Changed - Luxe Celebrations',
      html: `<p>Your password has been successfully changed. If you didn't do this, contact support immediately.</p>`,
    });

    sendSuccess(res, 'Password reset successful. Please login with your new password.');
  } catch (error) {
    sendError(res, 'Password reset failed', 500, String(error));
  }
};

// ─── Get Me ───────────────────────────────────────────────────────────────────
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id)
      .populate('wishlist', 'title slug images price discountedPrice rating')
      .populate('bookings', 'bookingId bookingStatus date service');

    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    sendSuccess(res, 'Profile fetched', user);
  } catch (error) {
    sendError(res, 'Failed to fetch profile', 500, String(error));
  }
};
