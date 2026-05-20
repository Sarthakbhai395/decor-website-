import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ─── User Types ───────────────────────────────────────────────────────────────

export interface IAddress {
  _id?: Types.ObjectId;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  addresses: IAddress[];
  wishlist: Types.ObjectId[];
  bookings: Types.ObjectId[];
  isVerified: boolean;
  isActive: boolean;
  otp?: string;
  otpExpiry?: Date;
  refreshToken?: string;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// ─── Service Types ────────────────────────────────────────────────────────────

export interface IServiceImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface IServiceVideo {
  url: string;
  publicId: string;
  thumbnail?: string;
}

export interface IService extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: IServiceImage[];
  videos: IServiceVideo[];
  category: Types.ObjectId;
  cities: Types.ObjectId[];
  price: number;
  discountedPrice?: number;
  duration: string;
  maxGuests: number;
  includes: string[];
  excludes: string[];
  highlights: string[];
  rating: number;
  reviewCount: number;
  reviews: Types.ObjectId[];
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Category Types ───────────────────────────────────────────────────────────

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  image: IServiceImage;
  icon: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── City Types ───────────────────────────────────────────────────────────────

export interface ICity extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  state: string;
  image: IServiceImage;
  isActive: boolean;
  serviceCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Booking Types ────────────────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partial';
export type PaymentMethod = 'razorpay' | 'stripe' | 'cod';

export interface IBooking extends Document {
  _id: Types.ObjectId;
  bookingId: string;
  user: Types.ObjectId;
  service: Types.ObjectId;
  city: Types.ObjectId;
  date: Date;
  timeSlot: string;
  guests: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  coupon?: Types.ObjectId;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  bookingStatus: BookingStatus;
  specialRequests?: string;
  address: IAddress;
  cancellationReason?: string;
  cancelledAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Review Types ─────────────────────────────────────────────────────────────

export interface IReview extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  service: Types.ObjectId;
  booking: Types.ObjectId;
  rating: number;
  comment: string;
  images: IServiceImage[];
  isVerified: boolean;
  isApproved: boolean;
  reply?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Coupon Types ─────────────────────────────────────────────────────────────

export type DiscountType = 'percentage' | 'fixed';

export interface ICoupon extends Document {
  _id: Types.ObjectId;
  code: string;
  description: string;
  discountType: DiscountType;
  discount: number;
  maxDiscount?: number;
  minOrderAmount: number;
  expiryDate: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableServices: Types.ObjectId[];
  applicableCategories: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Blog Types ───────────────────────────────────────────────────────────────

export interface IBlog extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: IServiceImage;
  author: Types.ObjectId;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  readTime: number;
  views: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Notification Types ───────────────────────────────────────────────────────

export interface INotification extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'review' | 'promo' | 'system';
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

// ─── Request Types ────────────────────────────────────────────────────────────

export interface AuthRequest extends Request {
  user?: IUser;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}
