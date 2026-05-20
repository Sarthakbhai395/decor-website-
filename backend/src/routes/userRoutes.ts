import { Router } from 'express';
import {
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  toggleWishlist,
  getWishlist,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getAllUsers,
  toggleUserStatus,
} from '../controllers/userController';
import { protect, restrictTo } from '../middleware/auth';
import { uploadAvatar } from '../config/cloudinary';

const router = Router();

// User routes
router.put('/profile', protect, uploadAvatar.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:serviceId', protect, toggleWishlist);
router.get('/notifications', protect, getNotifications);
router.patch('/notifications/:id/read', protect, markNotificationRead);
router.patch('/notifications/read-all', protect, markAllNotificationsRead);

// Admin routes
router.get('/', protect, restrictTo('admin'), getAllUsers);
router.patch('/:id/toggle-status', protect, restrictTo('admin'), toggleUserStatus);

export default router;
