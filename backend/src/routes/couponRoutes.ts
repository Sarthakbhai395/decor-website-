import { Router } from 'express';
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from '../controllers/couponController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

router.post('/validate', protect, validateCoupon);
router.get('/', protect, restrictTo('admin'), getCoupons);
router.post('/', protect, restrictTo('admin'), createCoupon);
router.put('/:id', protect, restrictTo('admin'), updateCoupon);
router.delete('/:id', protect, restrictTo('admin'), deleteCoupon);

export default router;
