import { Router } from 'express';
import {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  deleteServiceImage,
  getFeaturedServices,
  getRelatedServices,
} from '../controllers/serviceController';
import { protect, restrictTo } from '../middleware/auth';
import { uploadServiceImages } from '../config/cloudinary';

const router = Router();

// Public routes
router.get('/', getServices);
router.get('/featured', getFeaturedServices);
router.get('/:slug', getServiceBySlug);
router.get('/:slug/related', getRelatedServices);

// Admin routes
router.post(
  '/',
  protect,
  restrictTo('admin'),
  uploadServiceImages.array('images', 10),
  createService
);
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  uploadServiceImages.array('images', 10),
  updateService
);
router.delete('/:id', protect, restrictTo('admin'), deleteService);
router.delete('/:id/images/:publicId', protect, restrictTo('admin'), deleteServiceImage);

export default router;
