import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatDateShort = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

export const getDiscountPercentage = (price: number, discountedPrice: number): number => {
  return Math.round(((price - discountedPrice) / price) * 100);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const generateStars = (rating: number): string => {
  return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
};

export const getBookingStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'text-yellow-500 bg-yellow-500/10',
    confirmed: 'text-blue-500 bg-blue-500/10',
    in_progress: 'text-purple-500 bg-purple-500/10',
    completed: 'text-green-500 bg-green-500/10',
    cancelled: 'text-red-500 bg-red-500/10',
    refunded: 'text-gray-500 bg-gray-500/10',
  };
  return colors[status] || 'text-gray-500 bg-gray-500/10';
};

export const getPaymentStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'text-yellow-500',
    paid: 'text-green-500',
    failed: 'text-red-500',
    refunded: 'text-blue-500',
    partial: 'text-orange-500',
  };
  return colors[status] || 'text-gray-500';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
