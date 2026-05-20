import { Response } from 'express';
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import crypto from 'crypto';
import Booking from '../models/Booking';
import Service from '../models/Service';
import Coupon from '../models/Coupon';
import User from '../models/User';
import Notification from '../models/Notification';
import { AuthRequest } from '../types';
import {
  sendSuccess,
  sendCreated,
  sendError,
  sendNotFound,
  sendBadRequest,
  sendForbidden,
  getPaginationMeta,
} from '../utils/apiResponse';
import { getPaginationParams } from '../utils/helpers';
import { sendBookingConfirmationEmail } from '../utils/email';
import logger from '../utils/logger';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// ─── Create Booking ───────────────────────────────────────────────────────────
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      serviceId,
      cityId,
      date,
      timeSlot,
      guests,
      paymentMethod,
      couponCode,
      specialRequests,
      address,
    } = req.body;

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      sendNotFound(res, 'Service not found or unavailable');
      return;
    }

    // Check slot availability
    const existingBooking = await Booking.findOne({
      service: serviceId,
      date: new Date(date),
      timeSlot,
      bookingStatus: { $in: ['pending', 'confirmed', 'in_progress'] },
    });

    if (existingBooking) {
      sendBadRequest(res, 'This time slot is already booked. Please choose another.');
      return;
    }

    const effectivePrice = service.discountedPrice || service.price;
    let totalAmount = effectivePrice;
    let discountAmount = 0;
    let couponId;

    // Apply coupon
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() },
        usedCount: { $lt: { $ifNull: ['$usageLimit', 999999] } },
      });

      if (!coupon) {
        sendBadRequest(res, 'Invalid or expired coupon code');
        return;
      }

      if (totalAmount < coupon.minOrderAmount) {
        sendBadRequest(
          res,
          `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`
        );
        return;
      }

      if (coupon.discountType === 'percentage') {
        discountAmount = (totalAmount * coupon.discount) / 100;
        if (coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        }
      } else {
        discountAmount = coupon.discount;
      }

      couponId = coupon._id;
      await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
    }

    const finalAmount = Math.max(0, totalAmount - discountAmount);

    const booking = await Booking.create({
      user: req.user?._id,
      service: serviceId,
      city: cityId,
      date: new Date(date),
      timeSlot,
      guests,
      totalAmount,
      discountAmount,
      finalAmount,
      coupon: couponId,
      paymentMethod,
      specialRequests,
      address,
      bookingStatus: paymentMethod === 'cod' ? 'confirmed' : 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    });

    // Add booking to user
    await User.findByIdAndUpdate(req.user?._id, {
      $push: { bookings: booking._id },
    });

    // Create notification
    await Notification.create({
      user: req.user?._id,
      title: 'Booking Created',
      message: `Your booking for ${service.title} has been created.`,
      type: 'booking',
      link: `/dashboard/bookings/${booking._id}`,
    });

    // Handle payment
    if (paymentMethod === 'razorpay') {
      const order = await razorpay.orders.create({
        amount: finalAmount * 100, // paise
        currency: 'INR',
        receipt: booking.bookingId,
      });

      sendCreated(res, 'Booking created. Complete payment to confirm.', {
        booking,
        paymentOrder: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          key: process.env.RAZORPAY_KEY_ID,
        },
      });
      return;
    }

    if (paymentMethod === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: finalAmount * 100,
        currency: 'inr',
        metadata: { bookingId: booking.bookingId },
      });

      sendCreated(res, 'Booking created. Complete payment to confirm.', {
        booking,
        paymentIntent: {
          clientSecret: paymentIntent.client_secret,
        },
      });
      return;
    }

    // COD
    await sendBookingConfirmationEmail(
      req.user?.email || '',
      req.user?.name || '',
      {
        bookingId: booking.bookingId,
        service: service.title,
        date: new Date(date).toLocaleDateString('en-IN'),
        time: timeSlot,
        amount: finalAmount,
      }
    );

    sendCreated(res, 'Booking confirmed successfully', { booking });
  } catch (error) {
    logger.error(`Create booking error: ${error}`);
    sendError(res, 'Failed to create booking', 500, String(error));
  }
};

// ─── Verify Razorpay Payment ──────────────────────────────────────────────────
export const verifyRazorpayPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      sendBadRequest(res, 'Payment verification failed. Invalid signature.');
      return;
    }

    const booking = await Booking.findById(bookingId).populate('service', 'title');
    if (!booking) {
      sendNotFound(res, 'Booking not found');
      return;
    }

    booking.paymentStatus = 'paid';
    booking.paymentId = razorpay_payment_id;
    booking.bookingStatus = 'confirmed';
    await booking.save();

    const service = booking.service as unknown as { title: string };

    await sendBookingConfirmationEmail(
      req.user?.email || '',
      req.user?.name || '',
      {
        bookingId: booking.bookingId,
        service: service.title,
        date: booking.date.toLocaleDateString('en-IN'),
        time: booking.timeSlot,
        amount: booking.finalAmount,
      }
    );

    await Notification.create({
      user: req.user?._id,
      title: 'Payment Successful ✓',
      message: `Payment of ₹${booking.finalAmount} confirmed for booking #${booking.bookingId}`,
      type: 'payment',
      link: `/dashboard/bookings/${booking._id}`,
    });

    sendSuccess(res, 'Payment verified and booking confirmed', { booking });
  } catch (error) {
    sendError(res, 'Payment verification failed', 500, String(error));
  }
};

// ─── Get User Bookings ────────────────────────────────────────────────────────
export const getUserBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, status } = req.query;
    const { skip, limit: parsedLimit, page: parsedPage } = getPaginationParams(
      page as string,
      limit as string
    );

    const filter: Record<string, unknown> = { user: req.user?._id };
    if (status) filter.bookingStatus = status;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('service', 'title images slug')
        .populate('city', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Booking.countDocuments(filter),
    ]);

    sendSuccess(
      res,
      'Bookings fetched',
      bookings,
      200,
      getPaginationMeta(total, parsedPage, parsedLimit)
    );
  } catch (error) {
    sendError(res, 'Failed to fetch bookings', 500, String(error));
  }
};

// ─── Get Booking by ID ────────────────────────────────────────────────────────
export const getBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'title images slug description')
      .populate('city', 'name state')
      .populate('coupon', 'code discount discountType');

    if (!booking) {
      sendNotFound(res, 'Booking not found');
      return;
    }

    // Ensure user can only see their own bookings (unless admin)
    if (
      req.user?.role !== 'admin' &&
      booking.user.toString() !== req.user?._id.toString()
    ) {
      sendForbidden(res, 'Access denied');
      return;
    }

    sendSuccess(res, 'Booking fetched', booking);
  } catch (error) {
    sendError(res, 'Failed to fetch booking', 500, String(error));
  }
};

// ─── Cancel Booking ───────────────────────────────────────────────────────────
export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      sendNotFound(res, 'Booking not found');
      return;
    }

    if (booking.user.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      sendForbidden(res, 'Access denied');
      return;
    }

    if (['completed', 'cancelled', 'refunded'].includes(booking.bookingStatus)) {
      sendBadRequest(res, `Cannot cancel a ${booking.bookingStatus} booking`);
      return;
    }

    // Check cancellation window (24 hours before event)
    const hoursUntilEvent = (booking.date.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilEvent < 24 && req.user?.role !== 'admin') {
      sendBadRequest(res, 'Cancellation not allowed within 24 hours of the event');
      return;
    }

    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date();
    await booking.save();

    await Notification.create({
      user: booking.user,
      title: 'Booking Cancelled',
      message: `Your booking #${booking.bookingId} has been cancelled.`,
      type: 'booking',
    });

    sendSuccess(res, 'Booking cancelled successfully', booking);
  } catch (error) {
    sendError(res, 'Failed to cancel booking', 500, String(error));
  }
};

// ─── Admin: Get All Bookings ──────────────────────────────────────────────────
export const getAllBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, status, paymentStatus, search } = req.query;
    const { skip, limit: parsedLimit, page: parsedPage } = getPaginationParams(
      page as string,
      limit as string
    );

    const filter: Record<string, unknown> = {};
    if (status) filter.bookingStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('user', 'name email phone')
        .populate('service', 'title')
        .populate('city', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Booking.countDocuments(filter),
    ]);

    sendSuccess(
      res,
      'All bookings fetched',
      bookings,
      200,
      getPaginationMeta(total, parsedPage, parsedLimit)
    );
  } catch (error) {
    sendError(res, 'Failed to fetch bookings', 500, String(error));
  }
};

// ─── Admin: Update Booking Status ─────────────────────────────────────────────
export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        bookingStatus: status,
        ...(status === 'completed' ? { completedAt: new Date() } : {}),
      },
      { new: true }
    );

    if (!booking) {
      sendNotFound(res, 'Booking not found');
      return;
    }

    await Notification.create({
      user: booking.user,
      title: 'Booking Status Updated',
      message: `Your booking #${booking.bookingId} status is now: ${status}`,
      type: 'booking',
      link: `/dashboard/bookings/${booking._id}`,
    });

    sendSuccess(res, 'Booking status updated', booking);
  } catch (error) {
    sendError(res, 'Failed to update booking status', 500, String(error));
  }
};
