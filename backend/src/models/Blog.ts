import mongoose, { Schema } from 'mongoose';
import { IBlog } from '../types';

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    // slug has unique:true — already creates the index
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content:  { type: String, required: [true, 'Blog content is required'] },
    excerpt: {
      type: String,
      required: true,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    coverImage: {
      url:      { type: String, required: true },
      publicId: { type: String, required: true },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Decoration Tips',
        'Event Planning',
        'Romantic Ideas',
        'Wedding',
        'Birthday',
        'Anniversary',
        'Inspiration',
        'Trends',
      ],
    },
    tags:        [{ type: String }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    readTime:    { type: Number, default: 5 },
    views:       { type: Number, default: 0 },
    seoTitle:    { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// slug already indexed via unique:true — skip it
blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ author: 1 });
// Full-text search
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Blog = mongoose.model<IBlog>('Blog', blogSchema);
export default Blog;
