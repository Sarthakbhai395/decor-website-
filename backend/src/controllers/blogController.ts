import { Request, Response } from 'express';
import Blog from '../models/Blog';
import { AuthRequest } from '../types';
import {
  sendSuccess,
  sendCreated,
  sendError,
  sendNotFound,
  getPaginationMeta,
} from '../utils/apiResponse';
import { getPaginationParams, createSlug } from '../utils/helpers';

export const createBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = req.file as Express.Multer.File & { path: string; filename: string };
    const slug = createSlug(req.body.title);

    const blog = await Blog.create({
      ...req.body,
      slug,
      author: req.user?._id,
      coverImage: file ? { url: file.path, publicId: file.filename } : undefined,
      tags: JSON.parse(req.body.tags || '[]'),
      readTime: Math.ceil(req.body.content?.split(' ').length / 200) || 5,
      publishedAt: req.body.isPublished ? new Date() : undefined,
    });

    sendCreated(res, 'Blog created successfully', blog);
  } catch (error) {
    sendError(res, 'Failed to create blog', 500, String(error));
  }
};

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, category, search, tag } = req.query;
    const { skip, limit: parsedLimit, page: parsedPage } = getPaginationParams(
      page as string,
      limit as string
    );

    const filter: Record<string, unknown> = { isPublished: true };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (search) filter.$text = { $search: search as string };

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate('author', 'name avatar')
        .select('-content')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Blog.countDocuments(filter),
    ]);

    sendSuccess(
      res,
      'Blogs fetched',
      blogs,
      200,
      getPaginationMeta(total, parsedPage, parsedLimit)
    );
  } catch (error) {
    sendError(res, 'Failed to fetch blogs', 500, String(error));
  }
};

export const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name avatar');

    if (!blog) {
      sendNotFound(res, 'Blog not found');
      return;
    }

    sendSuccess(res, 'Blog fetched', blog);
  } catch (error) {
    sendError(res, 'Failed to fetch blog', 500, String(error));
  }
};

export const updateBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = req.file as Express.Multer.File & { path: string; filename: string };
    const updateData = { ...req.body };

    if (file) {
      updateData.coverImage = { url: file.path, publicId: file.filename };
    }

    if (req.body.title) {
      updateData.slug = createSlug(req.body.title);
    }

    if (req.body.isPublished === 'true' || req.body.isPublished === true) {
      updateData.publishedAt = new Date();
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      sendNotFound(res, 'Blog not found');
      return;
    }

    sendSuccess(res, 'Blog updated', blog);
  } catch (error) {
    sendError(res, 'Failed to update blog', 500, String(error));
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      sendNotFound(res, 'Blog not found');
      return;
    }
    sendSuccess(res, 'Blog deleted');
  } catch (error) {
    sendError(res, 'Failed to delete blog', 500, String(error));
  }
};

export const getAllBlogsAdmin = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .lean();
    sendSuccess(res, 'All blogs fetched', blogs);
  } catch (error) {
    sendError(res, 'Failed to fetch blogs', 500, String(error));
  }
};
