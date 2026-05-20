import mongoose, { Schema } from 'mongoose';
import { ICoupon } from '../types';

const couponSchema = new Schema<ICoupon>(
  {
    // code has unique:true — already creates the index
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: { type: String, required: true },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      min: [0, 'Discount cannot be negative'],
    },
    maxDiscount:     { type: Number },
    minOrderAmount:  { type: Number, default: 0 },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    usageLimit:  { type: Number, default: 100 },
    usedCount:   { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },
    applicableServices:   [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// code already indexed via unique:true — skip it
couponSchema.index({ isActive: 1, expiryDate: 1 });

const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
export default Coupon;
