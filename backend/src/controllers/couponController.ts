import { Request, Response } from 'express';
import Coupon from '../models/Coupon';
import { AuthRequest } from '../types';
import {
  sendSuccess,
  sendCreated,
  sendError,
  sendNotFound,
  sendBadRequest,
} from '../utils/apiResponse';

export const createCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.create(req.body);
    sendCreated(res, 'Coupon created successfully', coupon);
  } catch (error) {
    sendError(res, 'Failed to create coupon', 500, String(error));
  }
};

export const getCoupons = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    sendSuccess(res, 'Coupons fetched', coupons);
  } catch (error) {
    sendError(res, 'Failed to fetch coupons', 500, String(error));
  }
};

export const updateCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) {
      sendNotFound(res, 'Coupon not found');
      return;
    }
    sendSuccess(res, 'Coupon updated', coupon);
  } catch (error) {
    sendError(res, 'Failed to update coupon', 500, String(error));
  }
};

export const deleteCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      sendNotFound(res, 'Coupon not found');
      return;
    }
    sendSuccess(res, 'Coupon deleted');
  } catch (error) {
    sendError(res, 'Failed to delete coupon', 500, String(error));
  }
};

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, amount } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiryDate: { $gt: new Date() },
    });

    if (!coupon) {
      sendBadRequest(res, 'Invalid or expired coupon code');
      return;
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      sendBadRequest(res, 'Coupon usage limit reached');
      return;
    }

    if (amount < coupon.minOrderAmount) {
      sendBadRequest(res, `Minimum order amount is ₹${coupon.minOrderAmount}`);
      return;
    }

    let discountAmount =
      coupon.discountType === 'percentage'
        ? (amount * coupon.discount) / 100
        : coupon.discount;

    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }

    sendSuccess(res, 'Coupon applied successfully', {
      coupon: {
        id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discount: coupon.discount,
      },
      discountAmount,
      finalAmount: amount - discountAmount,
    });
  } catch (error) {
    sendError(res, 'Failed to validate coupon', 500, String(error));
  }
};
