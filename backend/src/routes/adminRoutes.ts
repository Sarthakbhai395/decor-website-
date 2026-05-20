import { Router } from 'express';
import { getDashboardAnalytics, getRevenueReport } from '../controllers/adminController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

router.use(protect, restrictTo('admin'));

router.get('/analytics', getDashboardAnalytics);
router.get('/revenue-report', getRevenueReport);

export default router;
