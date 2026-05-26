'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CategoryCard from './CategoryCard';

const BROWSE_CATS = [
  {
    label: 'Anniversary',
    slug: 'anniversary-decorations',
    emoji: '💑',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80&auto=format',
  },
  {
    label: 'Birthday',
    slug: 'birthday-decorations',
    emoji: '🎂',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80&auto=format',
  },
  {
    label: 'Kids Decor',
    slug: 'kids-decoration',
    emoji: '🎈',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80&auto=format',
  },
  {
    label: 'Car Decor',
    slug: 'car-decoration',
    emoji: '🚗',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80&auto=format',
  },
  {
    label: 'Wedding',
    slug: 'wedding-decoration',
    emoji: '💒',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80&auto=format',
  },
  {
    label: 'Corporate',
    slug: 'corporate-decoration',
    emoji: '🏢',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80&auto=format',
  },
];

export default function QuickCategories() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section
      ref={ref}
      className="bg-[#050505] border-b border-gold-500/10 py-3 sm:py-6 px-3 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label - Compact on Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="mb-2 sm:mb-4 text-left"
        >
          <span className="text-[9px] sm:text-xs text-gold-500/80 uppercase tracking-[0.15em] font-semibold">
            Browse Categories
          </span>
        </motion.div>

        {/* Categories - Horizontal Scroll on Mobile, 6-col Grid on Desktop */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-6 overflow-x-auto sm:overflow-visible no-scrollbar pb-1 sm:pb-0">
          {BROWSE_CATS.map((cat, i) => (
            <div key={cat.slug} className="w-[110px] sm:w-auto flex-shrink-0">
              <CategoryCard
                label={cat.label}
                slug={cat.slug}
                image={cat.image}
                emoji={cat.emoji}
                index={i}
                isDark={true}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
