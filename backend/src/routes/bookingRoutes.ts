import { Router } from 'express';
import {
  createBooking,
  verifyRazorpayPayment,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/bookingController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

// User routes
router.post('/', protect, createBooking);
router.post('/verify-payment', protect, verifyRazorpayPayment);
router.get('/my-bookings', protect, getUserBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/', protect, restrictTo('admin'), getAllBookings);
router.patch('/:id/status', protect, restrictTo('admin'), updateBookingStatus);

export default router;
