import { Response } from 'express';
import Booking from '../models/Booking';
import User from '../models/User';
import Service from '../models/Service';
import Review from '../models/Review';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/apiResponse';

// ─── Analytics Dashboard ──────────────────────────────────────────────────────
export const getDashboardAnalytics = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalBookings,
      monthBookings,
      lastMonthBookings,
      totalRevenue,
      monthRevenue,
      totalUsers,
      newUsers,
      pendingBookings,
      recentBookings,
      revenueByMonth,
      bookingsByStatus,
      topServices,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Booking.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      }),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } },
      ]),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } },
      ]),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),
      Booking.countDocuments({ bookingStatus: 'pending' }),
      Booking.find()
        .populate('user', 'name email')
        .populate('service', 'title')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            revenue: { $sum: '$finalAmount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),
      Booking.aggregate([
        { $group: { _id: '$bookingStatus', count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        {
          $group: {
            _id: '$service',
            bookings: { $sum: 1 },
            revenue: { $sum: '$finalAmount' },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'services',
            localField: '_id',
            foreignField: '_id',
            as: 'service',
          },
        },
        { $unwind: '$service' },
        {
          $project: {
            title: '$service.title',
            bookings: 1,
            revenue: 1,
          },
        },
      ]),
    ]);

    const totalRevenueAmount = totalRevenue[0]?.total || 0;
    const monthRevenueAmount = monthRevenue[0]?.total || 0;

    const bookingGrowth =
      lastMonthBookings > 0
        ? (((monthBookings - lastMonthBookings) / lastMonthBookings) * 100).toFixed(1)
        : '100';

    sendSuccess(res, 'Analytics fetched', {
      overview: {
        totalBookings,
        monthBookings,
        bookingGrowth: `${bookingGrowth}%`,
        totalRevenue: totalRevenueAmount,
        monthRevenue: monthRevenueAmount,
        totalUsers,
        newUsers,
        pendingBookings,
      },
      recentBookings,
      revenueByMonth,
      bookingsByStatus,
      topServices,
    });
  } catch (error) {
    sendError(res, 'Failed to fetch analytics', 500, String(error));
  }
};

// ─── Revenue Report ───────────────────────────────────────────────────────────
export const getRevenueReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const matchStage: Record<string, unknown> = { paymentStatus: 'paid' };
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) (matchStage.createdAt as Record<string, unknown>).$gte = new Date(startDate as string);
      if (endDate) (matchStage.createdAt as Record<string, unknown>).$lte = new Date(endDate as string);
    }

    const groupStage =
      groupBy === 'month'
        ? { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }
        : groupBy === 'week'
        ? { year: { $year: '$createdAt' }, week: { $week: '$createdAt' } }
        : { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } };

    const report = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupStage,
          revenue: { $sum: '$finalAmount' },
          bookings: { $sum: 1 },
          avgOrderValue: { $avg: '$finalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    sendSuccess(res, 'Revenue report fetched', report);
  } catch (error) {
    sendError(res, 'Failed to fetch revenue report', 500, String(error));
  }
};
