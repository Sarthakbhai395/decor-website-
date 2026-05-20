import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for service images
export const serviceImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'luxe-celebrations/services',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'fill', quality: 'auto' }],
  } as Record<string, unknown>,
});

// Storage for review images
export const reviewImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'luxe-celebrations/reviews',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'fill', quality: 'auto' }],
  } as Record<string, unknown>,
});

// Storage for blog images
export const blogImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'luxe-celebrations/blogs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 630, crop: 'fill', quality: 'auto' }],
  } as Record<string, unknown>,
});

// Storage for avatars
export const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'luxe-celebrations/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }],
  } as Record<string, unknown>,
});

// Storage for category images
export const categoryImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'luxe-celebrations/categories',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 600, height: 600, crop: 'fill', quality: 'auto' }],
  } as Record<string, unknown>,
});

export const uploadServiceImages = multer({
  storage: serviceImageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export const uploadReviewImages = multer({
  storage: reviewImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadBlogImage = multer({
  storage: blogImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const uploadCategoryImage = multer({
  storage: categoryImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const deleteFromCloudinary = async (publicId: string | string[]): Promise<void> => {
  if (Array.isArray(publicId)) {
    await Promise.all(publicId.map((id) => cloudinary.uploader.destroy(id)));
  } else {
    await cloudinary.uploader.destroy(publicId);
  }
};

export default cloudinary;
