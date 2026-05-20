'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, ArrowRight, Phone } from 'lucide-react';

const HERO_SLIDES = [
  {
    title: 'Create Magical',
    subtitle: 'Moments',
    description: 'Premium decoration & surprise planning across Delhi, Noida & Gurgaon.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=75&auto=format',
    cta: 'Explore Services',
    ctaLink: '/services',
  },
  {
    title: 'Romantic',
    subtitle: 'Surprises',
    description: 'Candlelight dinners, proposal setups & anniversary decor crafted with love.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=75&auto=format',
    cta: 'Plan Your Surprise',
    ctaLink: '/services',
  },
  {
    title: 'Luxury',
    subtitle: 'Celebrations',
    description: 'Breathtaking balloon art and premium decorations for every occasion.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=75&auto=format',
    cta: 'View Gallery',
    ctaLink: '/gallery',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % HERO_SLIDES.length),
      4500,
    );
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative flex items-center overflow-hidden bg-luxury-black"
      /* ── Mobile: 80 vh so the category strip peeks below ──
         ── Tablet+: cap at 520 px so it doesn't dominate large screens ── */
      style={{ height: isMobile ? '80svh' : 'clamp(420px, 55vh, 520px)' }}
    >
      {/* ── Background image slides ── */}
      <div className="absolute inset-0">
        {HERO_SLIDES.map((s, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === currentSlide ? 1 : 0 }}
            transition={{ duration: isMobile ? 0.7 : 1.1 }}
            style={{ willChange: 'opacity' }}
          >
            {/* Cinematic Ken-Burns scale on the active slide */}
            <motion.img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={i === 0 ? 'high' : 'low'}
              initial={{ scale: 1.08 }}
              animate={{ scale: i === currentSlide ? 1 : 1.08 }}
              transition={{ duration: 4.5, ease: 'easeOut' }}
              style={{ willChange: 'transform' }}
            />

            {/* Multi-layer cinematic overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/90" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
            {/* Vignette ring */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* ── Floating ambient particles (mobile-only, CSS-only, GPU-composited) ── */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${6 + i * 3}px`,
            height: `${6 + i * 3}px`,
            left: `${15 + i * 22}%`,
            bottom: '18%',
            background: 'rgba(201,169,110,0.25)',
            filter: 'blur(1px)',
            willChange: 'transform, opacity',
          }}
          animate={{
            y: [0, -(28 + i * 12), 0],
            opacity: [0.15, 0.45, 0.15],
          }}
          transition={{
            duration: 3.5 + i * 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.6,
          }}
        />
      ))}

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-16 sm:pt-20">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 sm:mb-5"
          style={{
            background: 'rgba(0,0,0,0.45)',
            border: '1px solid rgba(201,169,110,0.45)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Sparkles className="w-3 h-3 text-gold-500" />
          <span className="text-[11px] sm:text-xs text-gold-400 font-medium tracking-wide">
            Premium Luxury Experiences
          </span>
          <div className="flex items-center gap-0.5 ml-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2 h-2 text-gold-500 fill-gold-500" />
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: isMobile ? 0.28 : 0.45 }}
            className="font-display font-bold leading-[1.12] mb-3 sm:mb-4"
            style={{
              fontSize: 'clamp(2rem, 8vw, 4rem)',
              willChange: 'opacity, transform',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            <span className="text-white">{slide.title} </span>
            <span className="text-gold-gradient">{slide.subtitle}</span>
          </motion.h1>
        </AnimatePresence>

        {/* Description — visible on mobile too now that hero is tall */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.06 }}
            className="text-sm sm:text-base text-white/65 max-w-sm sm:max-w-lg mb-6 sm:mb-8 leading-relaxed"
          >
            {slide.description}
          </motion.p>
        </AnimatePresence>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="flex items-center gap-3"
        >
          <Link href={slide.ctaLink}>
            <button
              className="btn-luxury flex items-center gap-2 text-xs sm:text-sm px-5 sm:px-7 py-2.5 sm:py-3 active:scale-95 transition-transform"
              style={{ boxShadow: '0 8px 24px rgba(201,169,110,0.35)' }}
            >
              {slide.cta}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>

          <a
            href="tel:+919999999999"
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-white/85 text-xs sm:text-sm font-medium active:scale-95 transition-all"
            style={{
              border: '1px solid rgba(255,255,255,0.22)',
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Now</span>
          </a>
        </motion.div>

        {/* Trust strip — only on tall hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center gap-4 mt-8 sm:mt-10"
        >
          {[
            { value: '15K+', label: 'Happy Clients' },
            { value: '4.9★', label: 'Rating' },
            { value: '50+', label: 'Cities' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-sm sm:text-base font-bold text-gold-400 leading-none">{stat.value}</p>
              <p className="text-[10px] text-white/45 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Slide indicators ── */}
      <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 flex items-center gap-2 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === currentSlide
                ? 'w-6 h-1.5 bg-gold-500'
                : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* ── Scroll-hint chevron (mobile only) ── */}
      <motion.div
        className="absolute bottom-5 right-5 z-10 sm:hidden"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(201,169,110,0.35)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <svg
            className="w-3.5 h-3.5 text-gold-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
