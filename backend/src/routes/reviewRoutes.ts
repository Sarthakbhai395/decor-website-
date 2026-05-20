import { Router } from 'express';
import {
  createReview,
  getServiceReviews,
  getAllReviews,
  approveReview,
  replyToReview,
  deleteReview,
} from '../controllers/reviewController';
import { protect, restrictTo } from '../middleware/auth';
import { uploadReviewImages } from '../config/cloudinary';

const router = Router();

router.post('/', protect, uploadReviewImages.array('images', 5), createReview);
router.get('/service/:serviceId', getServiceReviews);
router.get('/', protect, restrictTo('admin'), getAllReviews);
router.patch('/:id/approve', protect, restrictTo('admin'), approveReview);
router.patch('/:id/reply', protect, restrictTo('admin'), replyToReview);
router.delete('/:id', protect, deleteReview);

export default router;
