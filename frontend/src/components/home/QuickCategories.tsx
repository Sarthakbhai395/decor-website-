'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const QUICK_CATS = [
  {
    label: 'Birthday Decorations',
    slug: 'birthday-decorations',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&q=80&auto=format',
  },
  {
    label: 'Kids Decoration',
    slug: 'kids-decoration',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80&auto=format',
  },
  {
    label: 'Candlelight Dinner',
    slug: 'candlelight-dinner',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80&auto=format',
  },
  {
    label: 'Anniversary Decoration',
    slug: 'anniversary-decorations',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&q=80&auto=format',
  },
  {
    label: 'Ring Decoration',
    slug: 'ring-decoration',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=300&q=80&auto=format',
  },
  {
    label: 'Sequin Decoration',
    slug: 'sequin-decoration',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&q=80&auto=format',
  },
];

export default function QuickCategories() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section ref={ref} className="py-10 sm:py-14 bg-luxury-black border-b border-gold-500/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 6 equal columns — fills full width */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
          {QUICK_CATS.map((cat, i) => (
            <motion.div
              key={cat.slug}
              ref={i === 0 ? ref : undefined}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link href={`/services?category=${cat.slug}`}>
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  {/* Circle — fills column width */}
                  <div className="w-full aspect-square rounded-full overflow-hidden ring-2 ring-gold-500/20 group-hover:ring-gold-500/70 transition-all duration-200">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {/* Label */}
                  <span className="text-center text-[10px] sm:text-xs font-medium text-white/70 group-hover:text-gold-400 transition-colors leading-tight px-1">
                    {cat.label}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
