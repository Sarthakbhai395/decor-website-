import crypto from 'crypto';

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateBookingId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LC-${timestamp}-${random}`;
};

export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const calculateDiscountPercentage = (
  originalPrice: number,
  discountedPrice: number
): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const getPaginationParams = (
  page?: string | number,
  limit?: string | number
): { skip: number; limit: number; page: number } => {
  const parsedPage = Math.max(1, parseInt(String(page || 1)));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(String(limit || 10))));
  const skip = (parsedPage - 1) * parsedLimit;
  return { skip, limit: parsedLimit, page: parsedPage };
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '').slice(-10);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
