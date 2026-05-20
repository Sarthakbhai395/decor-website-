import mongoose, { Schema } from 'mongoose';
import { IService } from '../types';

const serviceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    // unique:true already creates the index — no schema.index({ slug:1 }) needed
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description:      { type: String, required: [true, 'Description is required'] },
    shortDescription: {
      type: String,
      required: true,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    images: [
      {
        url:      { type: String, required: true },
        publicId: { type: String, required: true },
        alt:      { type: String },
      },
    ],
    videos: [
      {
        url:       { type: String },
        publicId:  { type: String },
        thumbnail: { type: String },
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    cities:          [{ type: Schema.Types.ObjectId, ref: 'City' }],
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountedPrice: { type: Number, min: [0, 'Discounted price cannot be negative'] },
    duration:        { type: String, default: '2-3 hours' },
    maxGuests:       { type: Number, default: 10 },
    includes:        [{ type: String }],
    excludes:        [{ type: String }],
    highlights:      [{ type: String }],
    rating:          { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:     { type: Number, default: 0 },
    reviews:         [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    isActive:        { type: Boolean, default: true },
    isFeatured:      { type: Boolean, default: false },
    tags:            [{ type: String }],
    seoTitle:        { type: String },
    seoDescription:  { type: String },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtuals ─────────────────────────────────────────────────────────────────
serviceSchema.virtual('discountPercentage').get(function () {
  if (this.discountedPrice && this.price > 0) {
    return Math.round(((this.price - this.discountedPrice) / this.price) * 100);
  }
  return 0;
});

serviceSchema.virtual('effectivePrice').get(function () {
  return this.discountedPrice ?? this.price;
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
// slug is already indexed via unique:true — skip it
// All other indexes below are for query performance only (not unique)
serviceSchema.index({ category: 1 });
serviceSchema.index({ cities: 1 });
serviceSchema.index({ isActive: 1, isFeatured: 1 });
serviceSchema.index({ isActive: 1, price: 1 });
serviceSchema.index({ rating: -1 });
serviceSchema.index({ createdAt: -1 });
// Full-text search index
serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Service = mongoose.model<IService>('Service', serviceSchema);
export default Service;
