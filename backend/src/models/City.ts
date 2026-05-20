import mongoose, { Schema } from 'mongoose';
import { ICity } from '../types';

const citySchema = new Schema<ICity>(
  {
    // name and slug both have unique:true — those already create indexes
    name: {
      type: String,
      required: [true, 'City name is required'],
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
    state:        { type: String, required: true },
    image: {
      url:      { type: String, required: true },
      publicId: { type: String, required: true },
    },
    isActive:     { type: Boolean, default: true },
    serviceCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// name and slug already indexed via unique:true — skip them
citySchema.index({ isActive: 1 });
citySchema.index({ state: 1 });

const City = mongoose.model<ICity>('City', citySchema);
export default City;
