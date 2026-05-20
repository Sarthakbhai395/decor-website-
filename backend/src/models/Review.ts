import mongoose, { Schema, Model } from 'mongoose';
import { IReview } from '../types';

// Forward-declare to avoid circular import issues at module load time
// Service is imported lazily inside the post-save hook
const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    images: [
      {
        url:      { type: String },
        publicId: { type: String },
      },
    ],
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    reply:      { type: String },
    repliedAt:  { type: Date },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
reviewSchema.index({ service: 1, isApproved: 1 });
reviewSchema.index({ user: 1 });
// booking is unique per review — one review per booking
reviewSchema.index({ booking: 1 }, { unique: true });

// ─── Post-save: update service aggregate rating ───────────────────────────────
// Use mongoose.model() lazily to avoid circular dependency at import time
reviewSchema.post('save', async function (this: IReview) {
  const ReviewModel = this.constructor as Model<IReview>;
  const stats = await ReviewModel.aggregate([
    { $match: { service: this.service, isApproved: true } },
    {
      $group: {
        _id: '$service',
        avgRating: { $avg: '$rating' },
        count:     { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    // Lazy require to avoid circular dependency
    const Service = mongoose.model('Service');
    await Service.findByIdAndUpdate(this.service, {
      rating:      Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }
});

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
