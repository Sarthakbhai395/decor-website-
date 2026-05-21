'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, ArrowRight, Phone } from 'lucide-react';

export default function CTASection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-24 bg-luxury-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920&q=80"
          alt="CTA Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/90 to-luxury-black" />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-3xl" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-10 right-10 w-32 h-32 border border-gold-500/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-10 left-10 w-24 h-24 border border-gold-500/10 rounded-full"
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-gold-500/30 mb-8">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span className="text-sm text-gold-400">Ready to Create Magic?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
            Let&apos;s Make Your{' '}
            <span className="text-gold-gradient">Dream Celebration</span>{' '}
            a Reality
          </h2>

          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            Book your luxury decoration experience today and let our expert team transform your special moment into an unforgettable memory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-luxury flex items-center gap-2"
              >
                Book Now
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>

            <a href="tel:+916306059912">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-luxury-outline flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Us Now
              </motion.button>
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-white/40">
            <span className="flex items-center gap-2">
              <span className="text-gold-500">✓</span> Free Consultation
            </span>
            <span className="flex items-center gap-2">
              <span className="text-gold-500">✓</span> 100% Satisfaction Guarantee
            </span>
            <span className="flex items-center gap-2">
              <span className="text-gold-500">✓</span> Professional Team
            </span>
            <span className="flex items-center gap-2">
              <span className="text-gold-500">✓</span> Same Day Booking
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
