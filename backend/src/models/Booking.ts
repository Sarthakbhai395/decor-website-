import mongoose, { Schema } from 'mongoose';
import { IBooking } from '../types';
import { generateBookingId } from '../utils/helpers';

const bookingSchema = new Schema<IBooking>(
  {
    // unique:true already creates the index — no schema.index({ bookingId:1 }) needed
    bookingId: {
      type: String,
      unique: true,
      default: generateBookingId,
    },
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
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    date:     { type: Date,   required: [true, 'Booking date is required'] },
    timeSlot: { type: String, required: [true, 'Time slot is required'] },
    guests: {
      type: Number,
      required: true,
      min: [1, 'At least 1 guest required'],
      default: 1,
    },
    totalAmount:    { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0 },
    finalAmount:    { type: Number, required: true, min: 0 },
    coupon:         { type: Schema.Types.ObjectId, ref: 'Coupon' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partial'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'stripe', 'cod'],
      required: true,
    },
    paymentId: { type: String },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    specialRequests: { type: String },
    address: {
      label:    { type: String },
      street:   { type: String, required: true },
      city:     { type: String, required: true },
      state:    { type: String, required: true },
      pincode:  { type: String, required: true },
      isDefault:{ type: Boolean },
    },
    cancellationReason: { type: String },
    cancelledAt:        { type: Date },
    completedAt:        { type: Date },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// bookingId already indexed via unique:true — skip it
// Compound index covers most common query: user's bookings sorted by date
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ service: 1, date: 1 });

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;
