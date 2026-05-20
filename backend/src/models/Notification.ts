import mongoose, { Schema } from 'mongoose';
import { INotification } from '../types';

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title:   { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['booking', 'payment', 'review', 'promo', 'system'],
      required: true,
    },
    isRead: { type: Boolean, default: false },
    link:   { type: String },
  },
  {
    timestamps: true,
    // Auto-expire notifications after 90 days to keep collection lean
    // Remove this if you want permanent notifications
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Compound index: fetch unread notifications for a user, newest first
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
// TTL index: auto-delete notifications older than 90 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;
