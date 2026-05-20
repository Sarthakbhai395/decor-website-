import { Router } from 'express';
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getAllBlogsAdmin,
} from '../controllers/blogController';
import { protect, restrictTo } from '../middleware/auth';
import { uploadBlogImage } from '../config/cloudinary';

const router = Router();

router.get('/', getBlogs);
router.get('/admin/all', protect, restrictTo('admin'), getAllBlogsAdmin);
router.get('/:slug', getBlogBySlug);
router.post('/', protect, restrictTo('admin'), uploadBlogImage.single('coverImage'), createBlog);
router.put('/:id', protect, restrictTo('admin'), uploadBlogImage.single('coverImage'), updateBlog);
router.delete('/:id', protect, restrictTo('admin'), deleteBlog);

export default router;
