'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    reset();
    setIsLoading(false);
  };

  return (
    <div className="luxury-card p-8">
      <h2 className="text-xl font-display font-bold text-white mb-6">Send a Message</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Your Name</label>
            <input {...register('name')} placeholder="Full name" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-all text-sm" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Phone (Optional)</label>
            <input {...register('phone')} placeholder="Mobile number" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-all text-sm" />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Email Address</label>
          <input {...register('email')} type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-all text-sm" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Subject</label>
          <input {...register('subject')} placeholder="How can we help?" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-all text-sm" />
          {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
        </div>

        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Message</label>
          <textarea {...register('message')} rows={5} placeholder="Tell us about your event..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-all text-sm resize-none" />
          {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-luxury py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
        </motion.button>
      </form>
    </div>
  );
}
