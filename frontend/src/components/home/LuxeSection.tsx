'use client';

import { Sparkles } from 'lucide-react';
import CategoryCard from './CategoryCard';

import { motion } from 'framer-motion';

const LUXE_CATS = [
  {
    label: 'Candlelight Dinner',
    slug: 'candlelight-dinner',
    emoji: '🕯️',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80&auto=format',
  },
  {
    label: 'Proposal',
    slug: 'ring-decoration',
    emoji: '💍',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&q=80&auto=format',
  },
  {
    label: 'Surprise',
    slug: 'surprise-decoration',
    emoji: '🎁',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80&auto=format',
  },
];

/* Injected once — shimmer sweep across the section */
const LUXE_CSS = `
@keyframes luxeShimmerSweep {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.luxe-shimmer-overlay {
  background-image: linear-gradient(120deg, transparent 35%, rgba(255, 220, 130, 0.08) 45%, rgba(255, 255, 255, 0.18) 50%, rgba(255, 220, 130, 0.08) 55%, transparent 65%);
  background-size: 250% 100%;
  animation: luxeShimmerSweep 6s linear infinite;
}
`;

export default function LuxeSection() {
  return (
    <section className="bg-[#050505] pt-14 sm:pt-16 pb-2 sm:pb-4 px-3 sm:px-6 lg:px-8">
      {/* Inject keyframes once */}
      <style>{LUXE_CSS}</style>

      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl p-3 sm:p-5 relative overflow-hidden"
        style={{
          backgroundColor: '#080808',
          backgroundImage: 'radial-gradient(circle at top left, rgba(201,169,110,0.15) 0%, transparent 60%)',
        }}
      >
        {/* Shimmer sweep overlay */}
        <div className="absolute inset-0 luxe-shimmer-overlay pointer-events-none z-0" />

        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-36 h-36 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:items-center justify-between sm:text-center mb-3 sm:mb-5 relative z-10">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-1 self-start sm:self-auto">
            <Sparkles className="w-2.5 h-2.5 text-[#f0d080] animate-pulse" />
            <span className="text-[#f0d080] text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase">
              Elite Premium
            </span>
          </div>
          <h2 className="text-xs sm:text-lg font-serif font-black tracking-widest text-white uppercase">
            THE <span className="text-gold-gradient font-black">LUXE</span> EXPERIENCE
          </h2>
        </div>

        {/* 3 Categories */}
        <div className="flex sm:grid sm:grid-cols-3 gap-3 sm:gap-5 overflow-x-auto sm:overflow-visible no-scrollbar pb-1 sm:pb-0 max-w-4xl mx-auto relative z-10">
          {LUXE_CATS.map((cat, index) => (
            <div key={cat.slug} className="w-[110px] sm:w-auto flex-shrink-0">
              <CategoryCard
                label={cat.label}
                slug={cat.slug}
                image={cat.image}
                emoji={cat.emoji}
                index={index}
                isDark={true}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
