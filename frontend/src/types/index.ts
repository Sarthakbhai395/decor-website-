// ─── User Types ───────────────────────────────────────────────────────────────

export interface IAddress {
  _id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  avatar?: string;
  addresses: IAddress[];
  wishlist: string[];
  bookings: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

// ─── Service Types ────────────────────────────────────────────────────────────

export interface IServiceImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface IService {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: IServiceImage[];
  category: ICategory;
  cities: ICity[];
  price: number;
  discountedPrice?: number;
  discountPercentage?: number;
  effectivePrice?: number;
  duration: string;
  maxGuests: number;
  includes: string[];
  excludes: string[];
  highlights: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

// ─── Category Types ───────────────────────────────────────────────────────────

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: IServiceImage;
  icon: string;
  isActive: boolean;
  order: number;
}

// ─── City Types ───────────────────────────────────────────────────────────────

export interface ICity {
  _id: string;
  name: string;
  slug: string;
  state: string;
  image: IServiceImage;
  isActive: boolean;
  serviceCount: number;
}

// ─── Booking Types ────────────────────────────────────────────────────────────

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partial';
export type PaymentMethod = 'razorpay' | 'stripe' | 'cod';

export interface IBooking {
  _id: string;
  bookingId: string;
  user: IUser | string;
  service: IService | string;
  city: ICity | string;
  date: string;
  timeSlot: string;
  guests: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  coupon?: ICoupon | string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  bookingStatus: BookingStatus;
  specialRequests?: string;
  address: IAddress;
  cancellationReason?: string;
  cancelledAt?: string;
  completedAt?: string;
  createdAt: string;
}

// ─── Review Types ─────────────────────────────────────────────────────────────

export interface IReview {
  _id: string;
  user: IUser | string;
  service: IService | string;
  booking: string;
  rating: number;
  comment: string;
  images: IServiceImage[];
  isVerified: boolean;
  isApproved: boolean;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
}

// ─── Coupon Types ─────────────────────────────────────────────────────────────

export interface ICoupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discount: number;
  maxDiscount?: number;
  minOrderAmount: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

// ─── Blog Types ───────────────────────────────────────────────────────────────

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: IServiceImage;
  author: IUser | string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  readTime: number;
  views: number;
  createdAt: string;
}

// ─── Notification Types ───────────────────────────────────────────────────────

export interface INotification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'review' | 'promo' | 'system';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ─── API Types ────────────────────────────────────────────────────────────────

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

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface ServiceFilters {
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  featured?: boolean;
  page?: number;
  limit?: number;
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface DashboardAnalytics {
  overview: {
    totalBookings: number;
    monthBookings: number;
    bookingGrowth: string;
    totalRevenue: number;
    monthRevenue: number;
    totalUsers: number;
    newUsers: number;
    pendingBookings: number;
  };
  recentBookings: IBooking[];
  revenueByMonth: Array<{ _id: { year: number; month: number }; revenue: number; count: number }>;
  bookingsByStatus: Array<{ _id: string; count: number }>;
  topServices: Array<{ title: string; bookings: number; revenue: number }>;
}
