'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Sparkles, ArrowLeft, Clock, Shield, Star } from 'lucide-react';
import { Suspense } from 'react';

const PHONE = '+916306059912';
const WA = '916306059912';

const TRUST_ITEMS = [
  { icon: Star,    text: '4.9★ Rated Service',       sub: '5,000+ happy clients' },
  { icon: Clock,   text: 'Same-Day Booking',          sub: 'Confirm in under 2 hours' },
  { icon: Shield,  text: '100% Satisfaction',         sub: 'Or full refund guaranteed' },
];

function BookingContactContent() {
  const params = useSearchParams();
  const serviceSlug = params.get('service') ?? '';
  const serviceTitle = serviceSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const waMessage = encodeURIComponent(
    serviceTitle
      ? `Hi! I'd like to book: ${serviceTitle}. Please help me plan this experience.`
      : "Hi! I'd like to book a luxury decoration experience. Please help me plan it.",
  );

  return (
    <div className="min-h-screen bg-luxury-black pt-16 sm:pt-20 pb-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <Link
            href={serviceSlug ? `/services/${serviceSlug}` : '/services'}
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to service
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)' }}>
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span className="text-sm text-gold-400 font-medium">Reserve Your Experience</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3 leading-tight">
            Let&apos;s Plan Your{' '}
            <span className="text-gold-gradient">Perfect Moment</span>
          </h1>

          {serviceTitle && (
            <p className="text-white/50 text-sm mb-2">
              Enquiring about:{' '}
              <span className="text-gold-400 font-medium">{serviceTitle}</span>
            </p>
          )}

          <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
            Our luxury experience specialists are available 24/7 to craft your perfect celebration.
          </p>
        </motion.div>

        {/* Contact cards */}
        <div className="space-y-4 mb-10">
          {/* WhatsApp */}
          <motion.a
            href={`https://wa.me/${WA}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-5 p-5 rounded-2xl cursor-pointer group"
            style={{
              background: 'linear-gradient(135deg, rgba(37,211,102,0.12) 0%, rgba(37,211,102,0.06) 100%)',
              border: '1px solid rgba(37,211,102,0.3)',
            }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
              style={{ background: '#25D366' }}>
              <MessageCircle className="w-7 h-7 text-white fill-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-white mb-0.5">Chat on WhatsApp</p>
              <p className="text-sm text-white/50">Instant reply · Share photos · Plan together</p>
            </div>
            <div className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold text-white"
              style={{ background: '#25D366' }}>
              Chat Now
            </div>
          </motion.a>

          {/* Call */}
          <motion.a
            href={`tel:${PHONE}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-5 p-5 rounded-2xl cursor-pointer group"
            style={{
              background: 'linear-gradient(135deg, rgba(201,169,110,0.12) 0%, rgba(201,169,110,0.06) 100%)',
              border: '1px solid rgba(201,169,110,0.3)',
            }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
              style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 100%)' }}>
              <Phone className="w-7 h-7 text-luxury-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-white mb-0.5">Call Our Specialists</p>
              <p className="text-sm text-white/50">Available 9 AM – 10 PM · Speak directly</p>
            </div>
            <div className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold text-luxury-black"
              style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 100%)' }}>
              Call Now
            </div>
          </motion.a>
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          className="grid grid-cols-3 gap-3"
        >
          {TRUST_ITEMS.map(({ icon: Icon, text, sub }, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-3 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="w-8 h-8 rounded-xl bg-gold-500/10 flex items-center justify-center mb-2">
                <Icon className="w-4 h-4 text-gold-500" />
              </div>
              <p className="text-[11px] font-semibold text-white leading-tight mb-0.5">{text}</p>
              <p className="text-[10px] text-white/40 leading-tight">{sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="my-8 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-xs text-white/25">or browse more</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Browse CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link href="/services">
            <button className="btn-luxury-outline text-sm px-8 py-2.5">
              Explore All Services
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function BookingContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-gold-500/30 border-t-gold-500 animate-spin" />
      </div>
    }>
      <BookingContactContent />
    </Suspense>
  );
}
