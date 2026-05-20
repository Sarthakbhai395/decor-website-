'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Balloon Decorations', slug: 'balloon-decorations', icon: '🎈', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=75&auto=format', count: '50+ Packages' },
  { name: 'Birthday Setups',     slug: 'birthday-decorations', icon: '🎂', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=75&auto=format', count: '40+ Packages' },
  { name: 'Anniversary Decor',   slug: 'anniversary-decorations', icon: '💑', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=75&auto=format', count: '35+ Packages' },
  { name: 'Proposal Planning',   slug: 'proposal-planning', icon: '💍', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=75&auto=format', count: '25+ Packages' },
  { name: 'Candlelight Dinner',  slug: 'candlelight-dinner', icon: '🕯️', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=75&auto=format', count: '20+ Packages' },
  { name: 'Wedding Decor',       slug: 'wedding-decor', icon: '💒', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=75&auto=format', count: '60+ Packages' },
  { name: 'Cabana Setup',        slug: 'cabana-setup', icon: '🏖️', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=75&auto=format', count: '15+ Packages' },
  { name: 'Baby Welcome',        slug: 'baby-welcome', icon: '👶', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=75&auto=format', count: '30+ Packages' },
];

export default function CategoriesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-luxury-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">
            What We Offer
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            Explore Our{' '}
            <span className="text-gold-gradient">Categories</span>
          </h2>
          <div className="section-divider" />
          <p className="text-white/50 max-w-2xl mx-auto mt-4">
            From intimate surprises to grand celebrations — we have the perfect package for every occasion.
          </p>
        </motion.div>

        {/* Grid — single fade-in, no per-card stagger on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
        >
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/categories/${cat.slug}`}>
              <div className="luxury-card group cursor-pointer overflow-hidden active:scale-95 transition-transform duration-150">
                {/* Image */}
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-2 right-2 text-xl sm:text-2xl">{cat.icon}</div>
                </div>
                {/* Content */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-gold-500 transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-white/40">{cat.count}</span>
                    <ArrowRight className="w-3 h-3 text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-center mt-10 sm:mt-12"
        >
          <Link href="/categories">
            <button className="btn-luxury-outline flex items-center gap-2 mx-auto active:scale-95 transition-transform duration-150">
              View All Categories
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
