import { Router, Request, Response } from 'express';
import Category from '../models/Category';
import City from '../models/City';
import { protect, restrictTo } from '../middleware/auth';
import { uploadCategoryImage } from '../config/cloudinary';
import { sendSuccess, sendCreated, sendError, sendNotFound } from '../utils/apiResponse';
import { createSlug } from '../utils/helpers';

const router = Router();

// Categories
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 }).lean();
    sendSuccess(res, 'Categories fetched', categories);
  } catch (error) {
    sendError(res, 'Failed to fetch categories', 500, String(error));
  }
});

router.post(
  '/categories',
  protect,
  restrictTo('admin'),
  uploadCategoryImage.single('image'),
  async (req: Request, res: Response) => {
    try {
      const file = req.file as Express.Multer.File & { path: string; filename: string };
      const category = await Category.create({
        ...req.body,
        slug: createSlug(req.body.name),
        image: { url: file.path, publicId: file.filename },
      });
      sendCreated(res, 'Category created', category);
    } catch (error) {
      sendError(res, 'Failed to create category', 500, String(error));
    }
  }
);

router.put(
  '/categories/:id',
  protect,
  restrictTo('admin'),
  uploadCategoryImage.single('image'),
  async (req: Request, res: Response) => {
    try {
      const file = req.file as Express.Multer.File & { path: string; filename: string };
      const updateData = { ...req.body };
      if (file) updateData.image = { url: file.path, publicId: file.filename };
      if (req.body.name) updateData.slug = createSlug(req.body.name);

      const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!category) { sendNotFound(res, 'Category not found'); return; }
      sendSuccess(res, 'Category updated', category);
    } catch (error) {
      sendError(res, 'Failed to update category', 500, String(error));
    }
  }
);

router.delete('/categories/:id', protect, restrictTo('admin'), async (req: Request, res: Response) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    sendSuccess(res, 'Category deleted');
  } catch (error) {
    sendError(res, 'Failed to delete category', 500, String(error));
  }
});

// Cities
router.get('/cities', async (_req: Request, res: Response) => {
  try {
    const cities = await City.find({ isActive: true }).sort({ name: 1 }).lean();
    sendSuccess(res, 'Cities fetched', cities);
  } catch (error) {
    sendError(res, 'Failed to fetch cities', 500, String(error));
  }
});

router.post(
  '/cities',
  protect,
  restrictTo('admin'),
  uploadCategoryImage.single('image'),
  async (req: Request, res: Response) => {
    try {
      const file = req.file as Express.Multer.File & { path: string; filename: string };
      const city = await City.create({
        ...req.body,
        slug: createSlug(req.body.name),
        image: { url: file.path, publicId: file.filename },
      });
      sendCreated(res, 'City created', city);
    } catch (error) {
      sendError(res, 'Failed to create city', 500, String(error));
    }
  }
);

router.put('/cities/:id', protect, restrictTo('admin'), async (req: Request, res: Response) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!city) { sendNotFound(res, 'City not found'); return; }
    sendSuccess(res, 'City updated', city);
  } catch (error) {
    sendError(res, 'Failed to update city', 500, String(error));
  }
});

router.delete('/cities/:id', protect, restrictTo('admin'), async (req: Request, res: Response) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    sendSuccess(res, 'City deleted');
  } catch (error) {
    sendError(res, 'Failed to delete city', 500, String(error));
  }
});

export default router;
