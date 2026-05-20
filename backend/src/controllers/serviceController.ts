import { Request, Response } from 'express';
import Service from '../models/Service';
import { AuthRequest } from '../types';
import {
  sendSuccess,
  sendCreated,
  sendError,
  sendNotFound,
  sendBadRequest,
  getPaginationMeta,
} from '../utils/apiResponse';
import { getPaginationParams, createSlug } from '../utils/helpers';
import { deleteFromCloudinary } from '../config/cloudinary';
import logger from '../utils/logger';

// ─── Get All Services ─────────────────────────────────────────────────────────
export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page,
      limit,
      category,
      city,
      minPrice,
      maxPrice,
      rating,
      search,
      sort = 'createdAt',
      order = 'desc',
      featured,
    } = req.query;

    const { skip, limit: parsedLimit, page: parsedPage } = getPaginationParams(
      page as string,
      limit as string
    );

    const filter: Record<string, unknown> = { isActive: true };

    if (category) filter.category = category;
    if (city) filter.cities = city;
    if (featured === 'true') filter.isFeatured = true;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, unknown>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, unknown>).$lte = Number(maxPrice);
    }

    if (rating) filter.rating = { $gte: Number(rating) };

    if (search) {
      filter.$text = { $search: search as string };
    }

    const sortObj: Record<string, 1 | -1> = {
      [sort as string]: order === 'asc' ? 1 : -1,
    };

    const [services, total] = await Promise.all([
      Service.find(filter)
        .populate('category', 'name slug icon')
        .populate('cities', 'name slug')
        .sort(sortObj)
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Service.countDocuments(filter),
    ]);

    sendSuccess(
      res,
      'Services fetched',
      services,
      200,
      getPaginationMeta(total, parsedPage, parsedLimit)
    );
  } catch (error) {
    logger.error(`Get services error: ${error}`);
    sendError(res, 'Failed to fetch services', 500, String(error));
  }
};

// ─── Get Service by Slug ──────────────────────────────────────────────────────
export const getServiceBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug icon')
      .populate('cities', 'name slug state')
      .populate({
        path: 'reviews',
        match: { isApproved: true },
        populate: { path: 'user', select: 'name avatar' },
        options: { limit: 10, sort: { createdAt: -1 } },
      });

    if (!service) {
      sendNotFound(res, 'Service not found');
      return;
    }

    sendSuccess(res, 'Service fetched', service);
  } catch (error) {
    sendError(res, 'Failed to fetch service', 500, String(error));
  }
};

// ─── Create Service (Admin) ───────────────────────────────────────────────────
export const createService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const images = files?.map((file) => ({
      url: (file as unknown as { path: string }).path,
      publicId: (file as unknown as { filename: string }).filename,
      alt: req.body.title,
    })) || [];

    const slug = createSlug(req.body.title);

    const service = await Service.create({
      ...req.body,
      slug,
      images,
      cities: JSON.parse(req.body.cities || '[]'),
      includes: JSON.parse(req.body.includes || '[]'),
      excludes: JSON.parse(req.body.excludes || '[]'),
      highlights: JSON.parse(req.body.highlights || '[]'),
      tags: JSON.parse(req.body.tags || '[]'),
    });

    sendCreated(res, 'Service created successfully', service);
  } catch (error) {
    logger.error(`Create service error: ${error}`);
    sendError(res, 'Failed to create service', 500, String(error));
  }
};

// ─── Update Service (Admin) ───────────────────────────────────────────────────
export const updateService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      sendNotFound(res, 'Service not found');
      return;
    }

    const files = req.files as Express.Multer.File[];
    if (files?.length > 0) {
      const newImages = files.map((file) => ({
        url: (file as unknown as { path: string }).path,
        publicId: (file as unknown as { filename: string }).filename,
        alt: req.body.title || service.title,
      }));
      req.body.images = [...service.images, ...newImages];
    }

    if (req.body.title && req.body.title !== service.title) {
      req.body.slug = createSlug(req.body.title);
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    sendSuccess(res, 'Service updated successfully', updatedService);
  } catch (error) {
    sendError(res, 'Failed to update service', 500, String(error));
  }
};

// ─── Delete Service (Admin) ───────────────────────────────────────────────────
export const deleteService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      sendNotFound(res, 'Service not found');
      return;
    }

    // Delete images from Cloudinary
    await Promise.all(
      service.images.map((img) => deleteFromCloudinary(img.publicId))
    );

    await service.deleteOne();
    sendSuccess(res, 'Service deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete service', 500, String(error));
  }
};

// ─── Delete Service Image (Admin) ─────────────────────────────────────────────
export const deleteServiceImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const publicId = req.params.publicId as string;
    const service = await Service.findById(id);

    if (!service) {
      sendNotFound(res, 'Service not found');
      return;
    }

    await deleteFromCloudinary(publicId);
    service.images = service.images.filter((img) => img.publicId !== publicId);
    await service.save();

    sendSuccess(res, 'Image deleted successfully', service);
  } catch (error) {
    sendError(res, 'Failed to delete image', 500, String(error));
  }
};

// ─── Get Featured Services ────────────────────────────────────────────────────
export const getFeaturedServices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug icon')
      .sort({ rating: -1 })
      .limit(8)
      .lean();

    sendSuccess(res, 'Featured services fetched', services);
  } catch (error) {
    sendError(res, 'Failed to fetch featured services', 500, String(error));
  }
};

// ─── Get Related Services ─────────────────────────────────────────────────────
export const getRelatedServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) {
      sendNotFound(res, 'Service not found');
      return;
    }

    const related = await Service.find({
      _id: { $ne: service._id },
      category: service.category,
      isActive: true,
    })
      .populate('category', 'name slug')
      .limit(4)
      .lean();

    sendSuccess(res, 'Related services fetched', related);
  } catch (error) {
    sendError(res, 'Failed to fetch related services', 500, String(error));
  }
};
