'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: { url: string; alt?: string };
}

// Fallback static categories shown while API loads or if API is unavailable
const FALLBACK_CATEGORIES: Category[] = [
  { _id: '1', name: 'Balloon Decorations', slug: 'balloon-decorations', description: 'Stunning balloon art for every occasion', icon: '🎈', image: { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80' } },
  { _id: '2', name: 'Romantic Setups', slug: 'romantic-setups', description: 'Intimate candlelight experiences', icon: '🕯️', image: { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80' } },
  { _id: '3', name: 'Birthday Surprises', slug: 'birthday-surprises', description: 'Make every birthday unforgettable', icon: '🎂', image: { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' } },
  { _id: '4', name: 'Anniversary Celebrations', slug: 'anniversary-celebrations', description: 'Celebrate your love story', icon: '💍', image: { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80' } },
  { _id: '5', name: 'Proposal Planning', slug: 'proposal-planning', description: 'The perfect way to say yes', icon: '💐', image: { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80' } },
  { _id: '6', name: 'Hotel Room Decor', slug: 'hotel-room-decor', description: 'Transform any room into paradise', icon: '🏨', image: { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80' } },
  { _id: '7', name: 'Wedding Decor', slug: 'wedding-decor', description: 'Your dream wedding, our masterpiece', icon: '👰', image: { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80' } },
  { _id: '8', name: 'Baby Shower', slug: 'baby-shower', description: 'Welcome the little one in style', icon: '👶', image: { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80' } },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategories(FALLBACK_CATEGORIES);
      } catch {
        // Backend offline — keep fallback categories silently
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-luxury-black pt-24">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-gold-500/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span className="text-sm text-gold-400 font-medium">All Categories</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-4"
          >
            Explore Our{' '}
            <span className="text-gold-gradient">Celebrations</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-divider"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/50 max-w-2xl mx-auto mt-4 text-lg leading-relaxed"
          >
            From intimate romantic setups to grand celebrations — discover the perfect
            category for your special moment.
          </motion.p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="luxury-card overflow-hidden animate-pulse">
                  <div className="h-52 bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {categories.map((category) => (
                <motion.div key={category._id} variants={cardVariants}>
                  <Link href={`/services?category=${category.slug}`}>
                    <div className="luxury-card overflow-hidden group cursor-pointer h-full">
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={category.image?.url}
                          alt={category.image?.alt || category.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Icon badge */}
                        <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-black/50 backdrop-blur-sm border border-gold-500/30 flex items-center justify-center text-xl">
                          {category.icon}
                        </div>

                        {/* Arrow on hover */}
                        <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                          <ArrowRight className="w-4 h-4 text-black" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-base font-semibold text-white group-hover:text-gold-400 transition-colors mb-1.5">
                          {category.name}
                        </h3>
                        <p className="text-sm text-white/50 leading-relaxed line-clamp-2">
                          {category.description}
                        </p>
                        <div className="mt-4 flex items-center gap-1.5 text-gold-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Explore services</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
