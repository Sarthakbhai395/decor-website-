import { Response } from 'express';
import { Types } from 'mongoose';
import User from '../models/User';
import Service from '../models/Service';
import Notification from '../models/Notification';
import { AuthRequest, IAddress } from '../types';
import {
  sendSuccess,
  sendError,
  sendNotFound,
  sendBadRequest,
  getPaginationMeta,
} from '../utils/apiResponse';
import { getPaginationParams } from '../utils/helpers';
import { deleteFromCloudinary } from '../config/cloudinary';

// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone } = req.body;
    const file = req.file as Express.Multer.File & { path: string; filename: string };

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    if (file) {
      // Delete old avatar
      const user = await User.findById(req.user?._id);
      if (user?.avatar) {
        const publicId = user.avatar.split('/').pop()?.split('.')[0];
        if (publicId) await deleteFromCloudinary(`luxe-celebrations/avatars/${publicId}`);
      }
      updateData.avatar = file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    sendSuccess(res, 'Profile updated successfully', updatedUser);
  } catch (error) {
    sendError(res, 'Failed to update profile', 500, String(error));
  }
};

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id).select('+password');
    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      sendBadRequest(res, 'Current password is incorrect');
      return;
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, 'Password changed successfully');
  } catch (error) {
    sendError(res, 'Failed to change password', 500, String(error));
  }
};

// ─── Manage Addresses ─────────────────────────────────────────────────────────
export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    if (req.body.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push(req.body);
    await user.save();

    sendSuccess(res, 'Address added successfully', user.addresses);
  } catch (error) {
    sendError(res, 'Failed to add address', 500, String(error));
  }
};

export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    const address = user.addresses.find(
      (addr) => (addr as IAddress & { _id: Types.ObjectId })._id?.toString() === req.params.addressId
    );
    if (!address) {
      sendNotFound(res, 'Address not found');
      return;
    }

    if (req.body.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    Object.assign(address, req.body);
    await user.save();

    sendSuccess(res, 'Address updated successfully', user.addresses);
  } catch (error) {
    sendError(res, 'Failed to update address', 500, String(error));
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    user.addresses = user.addresses.filter(
      (addr) => (addr as IAddress & { _id: Types.ObjectId })._id?.toString() !== req.params.addressId
    ) as typeof user.addresses;
    await user.save();

    sendSuccess(res, 'Address deleted successfully', user.addresses);
  } catch (error) {
    sendError(res, 'Failed to delete address', 500, String(error));
  }
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export const toggleWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { serviceId } = req.params;
    const user = await User.findById(req.user?._id);

    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      sendNotFound(res, 'Service not found');
      return;
    }

    const isWishlisted = user.wishlist.some((id) => id.toString() === serviceId);

    if (isWishlisted) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== serviceId) as typeof user.wishlist;
      await user.save();
      sendSuccess(res, 'Removed from wishlist', { isWishlisted: false });
    } else {
      user.wishlist.push(service._id);
      await user.save();
      sendSuccess(res, 'Added to wishlist', { isWishlisted: true });
    }
  } catch (error) {
    sendError(res, 'Failed to update wishlist', 500, String(error));
  }
};

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).populate({
      path: 'wishlist',
      select: 'title slug images price discountedPrice rating category',
      populate: { path: 'category', select: 'name slug' },
    });

    sendSuccess(res, 'Wishlist fetched', user?.wishlist || []);
  } catch (error) {
    sendError(res, 'Failed to fetch wishlist', 500, String(error));
  }
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit } = req.query;
    const { skip, limit: parsedLimit, page: parsedPage } = getPaginationParams(
      page as string,
      limit as string
    );

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ user: req.user?._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Notification.countDocuments({ user: req.user?._id }),
      Notification.countDocuments({ user: req.user?._id, isRead: false }),
    ]);

    sendSuccess(
      res,
      'Notifications fetched',
      { notifications, unreadCount },
      200,
      getPaginationMeta(total, parsedPage, parsedLimit)
    );
  } catch (error) {
    sendError(res, 'Failed to fetch notifications', 500, String(error));
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id },
      { isRead: true }
    );
    sendSuccess(res, 'Notification marked as read');
  } catch (error) {
    sendError(res, 'Failed to update notification', 500, String(error));
  }
};

export const markAllNotificationsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.updateMany({ user: req.user?._id, isRead: false }, { isRead: true });
    sendSuccess(res, 'All notifications marked as read');
  } catch (error) {
    sendError(res, 'Failed to update notifications', 500, String(error));
  }
};

// ─── Admin: Get All Users ─────────────────────────────────────────────────────
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, search, role } = req.query;
    const { skip, limit: parsedLimit, page: parsedPage } = getPaginationParams(
      page as string,
      limit as string
    );

    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -refreshToken -otp -otpExpiry')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      User.countDocuments(filter),
    ]);

    sendSuccess(
      res,
      'Users fetched',
      users,
      200,
      getPaginationMeta(total, parsedPage, parsedLimit)
    );
  } catch (error) {
    sendError(res, 'Failed to fetch users', 500, String(error));
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    sendSuccess(res, `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, {
      isActive: user.isActive,
    });
  } catch (error) {
    sendError(res, 'Failed to update user status', 500, String(error));
  }
};
