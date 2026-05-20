'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

function OTPForm() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { setUser, setAccessToken } = useAuthStore();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp: otpString });
      setUser(data.data.user);
      setAccessToken(data.data.accessToken);
      toast.success('Email verified successfully!');
      router.push('/dashboard/bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('New OTP sent to your email');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="text-4xl mb-4">📧</div>
      <h1 className="text-3xl font-display font-bold text-white mb-2">Verify Your Email</h1>
      <p className="text-white/50 mb-2">
        We&apos;ve sent a 6-digit OTP to
      </p>
      <p className="text-gold-500 font-medium mb-8">{email}</p>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border transition-all outline-none
              ${digit
                ? 'bg-gold-500/10 border-gold-500 text-gold-500'
                : 'bg-white/5 border-white/10 text-white focus:border-gold-500/50'
              }`}
          />
        ))}
      </div>

      <motion.button
        onClick={handleVerify}
        disabled={isLoading || otp.join('').length !== 6}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full btn-luxury py-3 flex items-center justify-center gap-2 disabled:opacity-50 mb-4"
      >
        {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : 'Verify OTP'}
      </motion.button>

      <div className="text-sm text-white/50">
        {countdown > 0 ? (
          <span>Resend OTP in <span className="text-gold-500">{countdown}s</span></span>
        ) : (
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-gold-500 hover:text-gold-400 flex items-center gap-1 mx-auto"
          >
            {isResending ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            Resend OTP
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
      <OTPForm />
    </Suspense>
  );
}
