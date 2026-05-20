import { Response } from 'express';
import Review from '../models/Review';
import Booking from '../models/Booking';
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

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { serviceId, bookingId, rating, comment } = req.body;
    const files = req.files as (Express.Multer.File & { path: string; filename: string })[];

    // Verify booking belongs to user and is completed
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user?._id,
      bookingStatus: 'completed',
    });

    if (!booking) {
      sendBadRequest(res, 'You can only review completed bookings');
      return;
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      sendBadRequest(res, 'You have already reviewed this booking');
      return;
    }

    const images = files?.map((f) => ({ url: f.path, publicId: f.filename })) || [];

    const review = await Review.create({
      user: req.user?._id,
      service: serviceId,
      booking: bookingId,
      rating,
      comment,
      images,
      isVerified: true,
    });

    sendCreated(res, 'Review submitted successfully. It will be visible after approval.', review);
  } catch (error) {
    sendError(res, 'Failed to submit review', 500, String(error));
  }
};

export const getServiceReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { serviceId } = req.params;
    const { page, limit } = req.query;
    const { skip, limit: parsedLimit, page: parsedPage } = getPaginationParams(
      page as string,
      limit as string
    );

    const [reviews, total] = await Promise.all([
      Review.find({ service: serviceId, isApproved: true })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Review.countDocuments({ service: serviceId, isApproved: true }),
    ]);

    sendSuccess(
      res,
      'Reviews fetched',
      reviews,
      200,
      getPaginationMeta(total, parsedPage, parsedLimit)
    );
  } catch (error) {
    sendError(res, 'Failed to fetch reviews', 500, String(error));
  }
};

export const getAllReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, approved } = req.query;
    const { skip, limit: parsedLimit, page: parsedPage } = getPaginationParams(
      page as string,
      limit as string
    );

    const filter: Record<string, unknown> = {};
    if (approved !== undefined) filter.isApproved = approved === 'true';

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('user', 'name email avatar')
        .populate('service', 'title slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    sendSuccess(
      res,
      'Reviews fetched',
      reviews,
      200,
      getPaginationMeta(total, parsedPage, parsedLimit)
    );
  } catch (error) {
    sendError(res, 'Failed to fetch reviews', 500, String(error));
  }
};

export const approveReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      sendNotFound(res, 'Review not found');
      return;
    }

    sendSuccess(res, 'Review approved', review);
  } catch (error) {
    sendError(res, 'Failed to approve review', 500, String(error));
  }
};

export const replyToReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reply } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { reply, repliedAt: new Date() },
      { new: true }
    );

    if (!review) {
      sendNotFound(res, 'Review not found');
      return;
    }

    sendSuccess(res, 'Reply added', review);
  } catch (error) {
    sendError(res, 'Failed to add reply', 500, String(error));
  }
};

export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      sendNotFound(res, 'Review not found');
      return;
    }

    if (review.user.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      sendForbidden(res, 'Access denied');
      return;
    }

    await review.deleteOne();
    sendSuccess(res, 'Review deleted');
  } catch (error) {
    sendError(res, 'Failed to delete review', 500, String(error));
  }
};
