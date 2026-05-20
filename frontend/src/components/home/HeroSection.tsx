'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, ArrowRight, Play, X } from 'lucide-react';

const HERO_SLIDES = [
  {
    title: 'Create Magical',
    subtitle: 'Moments Together',
    description: 'Transform your special occasions into unforgettable luxury experiences with our premium decoration services.',
    // Serve smaller images on mobile via srcset — 800w is plenty for phones
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=75&auto=format',
    cta: 'Explore Services',
    ctaLink: '/services',
  },
  {
    title: 'Romantic Surprises',
    subtitle: 'Beyond Imagination',
    description: 'From intimate candlelight dinners to grand proposal setups — we craft every detail with love.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=75&auto=format',
    cta: 'Plan Your Surprise',
    ctaLink: '/services',
  },
  {
    title: 'Luxury Balloon',
    subtitle: 'Decorations',
    description: 'Breathtaking balloon art and premium decorations that turn any space into a celebration.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=75&auto=format',
    cta: 'View Gallery',
    ctaLink: '/gallery',
  },
];

// Reduced to 3 balloons, CSS-only animation (no framer-motion per balloon)
const BALLOONS = [
  { color: 'radial-gradient(circle, #f4c2c2, #e879a0)', size: 40, x: 10, delay: '0s' },
  { color: 'radial-gradient(circle, #c9a96e, #f0d080)', size: 50, x: 70, delay: '3s' },
  { color: 'radial-gradient(circle, #a855f7, #7c3aed)', size: 32, x: 45, delay: '6s' },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile once on mount — disable heavy effects on mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-luxury-black">
      {/* Background — no parallax on mobile (kills performance) */}
      <div className="absolute inset-0">
        {HERO_SLIDES.map((s, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === currentSlide ? 1 : 0 }}
            transition={{ duration: isMobile ? 0.8 : 1.5 }}
            style={{ willChange: 'opacity' }}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover"
              // Only eager-load the first slide; lazy-load the rest
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={i === 0 ? 'high' : 'low'}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Floating Balloons — CSS animation, hidden on mobile to save GPU */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {BALLOONS.map((b, i) => (
            <div
              key={i}
              className="absolute bottom-0 rounded-full opacity-0"
              style={{
                width: b.size,
                height: b.size * 1.2,
                left: `${b.x}%`,
                background: b.color,
                animation: `heroBalloon 10s ease-out ${b.delay} infinite`,
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-20 pb-24 sm:pb-0 w-full">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-gold-500/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span className="text-sm text-gold-400 font-medium">Premium Luxury Experiences</span>
            <div className="flex items-center gap-0.5 ml-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-gold-500 fill-gold-500" />
              ))}
            </div>
          </motion.div>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: isMobile ? 0.3 : 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-display font-bold leading-tight mb-4"
              style={{ willChange: 'opacity, transform' }}
            >
              <span className="text-white">{slide.title}</span>
              <br />
              <span className="text-gold-gradient">{slide.subtitle}</span>
            </motion.h1>
          </AnimatePresence>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${currentSlide}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: isMobile ? 0.25 : 0.5, delay: isMobile ? 0 : 0.1 }}
              className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mb-8 sm:mb-10 leading-relaxed"
            >
              {slide.description}
            </motion.p>
          </AnimatePresence>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: isMobile ? 0.1 : 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link href={slide.ctaLink}>
              <button className="btn-luxury flex items-center gap-2 text-sm active:scale-95 transition-transform">
                {slide.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <button
              onClick={() => setIsVideoOpen(true)}
              className="flex items-center gap-3 text-white/70 active:text-white transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-black/40 border border-white/20 flex items-center justify-center">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <span className="text-sm font-medium">Watch Our Story</span>
            </button>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 sm:bottom-12 left-4 sm:left-6 lg:left-8 flex items-center gap-3">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === currentSlide ? 'w-8 h-2 bg-gold-500' : 'w-2 h-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator — desktop only */}
        <div className="hidden sm:flex absolute bottom-12 right-6 lg:right-8 flex-col items-center gap-2">
          <span className="text-xs text-white/30 tracking-widest uppercase rotate-90 origin-center mb-4">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-gold-500/50 to-transparent" />
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Luxe Celebrations Story"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
