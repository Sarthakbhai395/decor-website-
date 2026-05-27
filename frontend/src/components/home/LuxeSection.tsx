'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

/* ─── Featured Luxe Categories ───────────────────────────────────────────── */
const LUXE_CATS = [
  {
    label: 'Candlelight Dinner',
    slug: 'candlelight-dinner',
    emoji: '🕯️',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80&auto=format',
  },
  {
    label: 'Proposal',
    slug: 'ring-decoration',
    emoji: '💍',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=80&auto=format',
  },
  {
    label: 'Surprise',
    slug: 'surprise-decoration',
    emoji: '🎁',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80&auto=format',
  },
];

/* ─── Shimmer CSS ────────────────────────────────────────────────────────── */
const LUXE_CSS = `
@keyframes luxeShimmerSweep {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.luxe-shimmer-overlay {
  background-image: linear-gradient(120deg, transparent 35%, rgba(255, 220, 130, 0.06) 45%, rgba(255, 255, 255, 0.12) 50%, rgba(255, 220, 130, 0.06) 55%, transparent 65%);
  background-size: 250% 100%;
  animation: luxeShimmerSweep 6s linear infinite;
}
`;

/* ─── Compact Luxe Card ──────────────────────────────────────────────────── */
function LuxeCard({
  cat,
  index,
}: {
  cat: (typeof LUXE_CATS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex-shrink-0"
    >
      <Link href={`/categories/${cat.slug}`} className="block group">
        <div
          className="relative w-[100px] sm:w-[140px] lg:w-[160px] rounded-2xl overflow-hidden transition-all duration-400"
          style={{
            background:
              'linear-gradient(180deg, rgba(30,28,24,0.9) 0%, rgba(12,12,12,0.98) 100%)',
            border: '1px solid rgba(201, 169, 110, 0.2)',
            boxShadow:
              '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 0.5px rgba(201, 169, 110, 0.1)',
          }}
        >
          {/* Image */}
          <div className="relative w-full aspect-[4/3.2] overflow-hidden rounded-t-2xl">
            <img
              src={cat.image}
              alt={cat.label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

            {/* Subtle glow overlay on hover */}
            <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-colors duration-500" />
          </div>

          {/* Label Area */}
          <div className="flex flex-col items-center py-2 sm:py-2.5 px-1.5 text-center">
            {/* Emoji badge */}
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white mb-1 sm:mb-1.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              style={{
                boxShadow:
                  '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
                border: '1.5px solid #c9a96e',
              }}
            >
              <span className="text-xs sm:text-sm">{cat.emoji}</span>
            </div>
            <h3 className="text-[9px] sm:text-[11px] font-semibold text-white/90 group-hover:text-[#f0d080] transition-colors duration-300 tracking-wide line-clamp-1">
              {index + 1}. {cat.label}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Section Component ──────────────────────────────────────────────────── */
export default function LuxeSection() {
  return (
    <section className="bg-[#050505] py-5 sm:py-8 px-3 sm:px-6 lg:px-8">
      {/* Inject shimmer keyframes once */}
      <style>{LUXE_CSS}</style>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-5 relative overflow-hidden"
        style={{
          backgroundColor: '#080808',
          backgroundImage:
            'radial-gradient(circle at top left, rgba(201,169,110,0.12) 0%, transparent 60%)',
        }}
      >
        {/* Shimmer sweep overlay */}
        <div className="absolute inset-0 luxe-shimmer-overlay pointer-events-none z-0" />

        {/* Ambient glow spot */}
        <div className="absolute top-0 right-1/4 w-28 h-28 bg-amber-500/5 rounded-full blur-[50px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-gold-500/5 rounded-full blur-[40px] pointer-events-none" />

        {/* Section Header — compact */}
        <div className="flex flex-col items-center text-center mb-3 sm:mb-4 relative z-10">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-1">
            <Sparkles className="w-2.5 h-2.5 text-[#f0d080] animate-pulse" />
            <span className="text-[#f0d080] text-[7px] sm:text-[8px] font-bold tracking-[0.2em] uppercase">
              Elite Premium
            </span>
          </div>
          <h2 className="text-[11px] sm:text-base lg:text-lg font-serif font-black tracking-widest text-white uppercase">
            THE <span className="text-gold-gradient font-black">LUXE</span> EXPERIENCE
          </h2>
        </div>

        {/* 3 compact cards — centered */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 relative z-10">
          {LUXE_CATS.map((cat, index) => (
            <LuxeCard key={cat.slug} cat={cat} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
