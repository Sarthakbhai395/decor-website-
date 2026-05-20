'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Phone, Mail, Camera, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit phone number'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(8, 'Min 8 characters').regex(/[A-Z]/, 'Needs uppercase').regex(/[0-9]/, 'Needs number'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, refreshUser } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: profileErrors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', phone: user?.phone || '' },
  });

  const { register: regPw, handleSubmit: handlePw, reset: resetPw, formState: { errors: pwErrors } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onUpdateProfile = async (data: ProfileForm) => {
    setIsUpdating(true);
    try {
      await api.put('/users/profile', data);
      await refreshUser();
      toast.success('Profile updated successfully');
    } finally {
      setIsUpdating(false);
    }
  };

  const onChangePassword = async (data: PasswordForm) => {
    setIsChangingPassword(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      resetPw();
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Profile Settings</h1>
        <p className="text-white/50 text-sm mt-1">Manage your personal information</p>
      </div>

      {/* Avatar */}
      <div className="luxury-card p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-luxury-black">{user?.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-luxury-black" />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
            <p className="text-sm text-white/50">{user?.email}</p>
            <span className="text-xs text-gold-500 mt-1 block">Premium Member</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="luxury-card p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Personal Information</h2>
        <form onSubmit={handleProfile(onUpdateProfile)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input {...regProfile('name')} className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold-500/50 transition-all text-sm" />
              </div>
              {profileErrors.name && <p className="text-red-400 text-xs mt-1">{profileErrors.name.message}</p>}
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input {...regProfile('phone')} className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold-500/50 transition-all text-sm" />
              </div>
              {profileErrors.phone && <p className="text-red-400 text-xs mt-1">{profileErrors.phone.message}</p>}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input value={user?.email || ''} disabled className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm cursor-not-allowed" />
            </div>
            <p className="text-xs text-white/30 mt-1">Email cannot be changed</p>
          </div>
          <motion.button type="submit" disabled={isUpdating} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-luxury px-8 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50">
            {isUpdating ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
          </motion.button>
        </form>
      </div>

      {/* Change Password */}
      <div className="luxury-card p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Change Password</h2>
        <form onSubmit={handlePw(onChangePassword)} className="space-y-5">
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input {...regPw('currentPassword')} type={showCurrentPw ? 'text' : 'password'} className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold-500/50 transition-all text-sm" />
              <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {pwErrors.currentPassword && <p className="text-red-400 text-xs mt-1">{pwErrors.currentPassword.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input {...regPw('newPassword')} type={showNewPw ? 'text' : 'password'} className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold-500/50 transition-all text-sm" />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pwErrors.newPassword && <p className="text-red-400 text-xs mt-1">{pwErrors.newPassword.message}</p>}
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input {...regPw('confirmPassword')} type="password" className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold-500/50 transition-all text-sm" />
              </div>
              {pwErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{pwErrors.confirmPassword.message}</p>}
            </div>
          </div>
          <motion.button type="submit" disabled={isChangingPassword} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-luxury px-8 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50">
            {isChangingPassword ? <><Loader2 className="w-4 h-4 animate-spin" /> Changing...</> : 'Change Password'}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
