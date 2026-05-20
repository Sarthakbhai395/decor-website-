import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../types';

const categorySchema = new Schema<ICategory>(
  {
    // name and slug both have unique:true — those already create indexes
    // Do NOT add schema.index({ name:1 }) or schema.index({ slug:1 }) below
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, default: '' },
    image: {
      url:      { type: String, required: true },
      publicId: { type: String, required: true },
      alt:      { type: String },
    },
    icon:     { type: String, default: '🎉' },
    isActive: { type: Boolean, default: true },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// name and slug already indexed via unique:true — skip them
categorySchema.index({ isActive: 1, order: 1 });

const Category = mongoose.model<ICategory>('Category', categorySchema);
export default Category;
