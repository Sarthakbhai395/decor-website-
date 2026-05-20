import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../types';

// ─── Address Sub-Schema ───────────────────────────────────────────────────────
// No index needed on subdocuments — they are embedded, not queried independently
const addressSchema = new Schema(
  {
    label:    { type: String, default: 'Home' },
    street:   { type: String, required: true },
    city:     { type: String, required: true },
    state:    { type: String, required: true },
    pincode:  { type: String, required: true },
    isDefault:{ type: Boolean, default: false },
  },
  { _id: true } // keep _id so we can find/update by subdoc id
);

// ─── User Schema ──────────────────────────────────────────────────────────────
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      // unique: true here already creates the index — do NOT add schema.index({ email:1 }) below
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar:   { type: String },
    addresses: [addressSchema],
    wishlist:  [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    bookings:  [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    isVerified:           { type: Boolean, default: false },
    isActive:             { type: Boolean, default: true },
    otp:                  { type: String, select: false },
    otpExpiry:            { type: Date,   select: false },
    refreshToken:         { type: String, select: false },
    passwordResetToken:   { type: String, select: false },
    passwordResetExpiry:  { type: Date,   select: false },
    lastLogin:            { type: Date },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// email already indexed via unique:true above — skip it here
// phone and role are NOT unique so we add explicit indexes for query performance
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// ─── Hooks ────────────────────────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
// jsonwebtoken only accepts lowercase time units: s, m, h, d, w, y
// "30D" silently fails — normalize to lowercase before passing to jwt.sign()
const normalizeExpiry = (value: string): string => value.toLowerCase();

// ─── Methods ──────────────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  const expiry = normalizeExpiry(process.env.JWT_EXPIRES_IN || '15m');
  const options: SignOptions = {
    expiresIn: expiry as SignOptions['expiresIn'],
  };
  return jwt.sign({ id: this._id.toString(), role: this.role }, secret, options);
};

userSchema.methods.generateRefreshToken = function (): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not configured');
  const expiry = normalizeExpiry(process.env.JWT_REFRESH_EXPIRES_IN || '7d');
  const options: SignOptions = {
    expiresIn: expiry as SignOptions['expiresIn'],
  };
  return jwt.sign({ id: this._id.toString() }, secret, options);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
