'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles } from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface BrowseCategory {
  label: string;
  slug: string;
  emoji: string;
  image: string;
}

/* ─── Category Data (9 items, 3×3 grid) ──────────────────────────────────── */
const BROWSE_CATEGORIES: BrowseCategory[] = [
  {
    label: 'Car Decor',
    slug: 'car-decoration',
    emoji: '🚗',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=75&auto=format',
  },
  {
    label: 'Candlelight Dinner',
    slug: 'candlelight-dinner',
    emoji: '🕯️',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=75&auto=format',
  },
  {
    label: 'Proposal',
    slug: 'ring-decoration',
    emoji: '💍',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=75&auto=format',
  },
  {
    label: 'Birthday',
    slug: 'birthday-decorations',
    emoji: '🎂',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=75&auto=format',
  },
  {
    label: 'Anniversary',
    slug: 'anniversary-decorations',
    emoji: '💑',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=75&auto=format',
  },
  {
    label: 'Kids Decor',
    slug: 'kids-decoration',
    emoji: '🎈',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75&auto=format',
  },
  {
    label: 'Wedding',
    slug: 'wedding-decoration',
    emoji: '💒',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=75&auto=format',
  },
  {
    label: 'Surprise',
    slug: 'surprise-decoration',
    emoji: '🎁',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=75&auto=format',
  },
  {
    label: 'Corporate',
    slug: 'corporate-decoration',
    emoji: '🏢',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=75&auto=format',
  },
];

/* ─── Trust strip items ──────────────────────────────────────────────────── */
const TRUST_ITEMS = [
  { icon: '🎨', title: 'Premium Quality', sub: 'Decorations' },
  { icon: '🚚', title: 'On-time', sub: 'Delivery' },
  { icon: '✨', title: 'Custom Designs', sub: 'For Every Occasion' },
  { icon: '💯', title: '100% Customer', sub: 'Satisfaction' },
];

/* ─── Stagger animation config ───────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

/* ─── Single Category Card (matches reference image design) ─────────────── */
function BrowseCategoryCard({ cat }: { cat: BrowseCategory }) {
  return (
    <motion.div variants={cardVariants}>
      <Link href={`/categories/${cat.slug}`} className="block group">
        <div className="relative flex flex-col items-center">
          {/* ── Image Container with rounded corners ── */}
          <div
            className="relative w-full aspect-[3/3.5] overflow-visible transition-all duration-400"
          >
            <div className="w-full h-full overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.06]" style={{ borderRadius: '16px' }}>
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              {/* Dark gradient overlay at bottom for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
              {/* Golden hover glow */}
              <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-500 pointer-events-none" />
            </div>

            {/* ── Golden Circle Icon Badge (overlapping image bottom) ── */}
            <div
              className="absolute flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                width: '40px',
                height: '40px',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderRadius: '50%',
                background: 'linear-gradient(145deg, #0a0a0a 0%, #111111 100%)',
                border: '2.5px solid #c9a96e',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6), 0 0 12px rgba(201, 169, 110, 0.2)',
                zIndex: 10,
              }}
            >
              <span className="text-sm drop-shadow-sm" style={{ filter: 'sepia(1) hue-rotate(-20deg) saturate(3) brightness(1.1)' }}>{cat.emoji}</span>
            </div>
          </div>

          {/* ── Category Label below ── */}
          <h3
            className="font-bold text-[10px] sm:text-xs text-white tracking-wide text-center mt-7 transition-colors duration-300 group-hover:text-[#f0d080] line-clamp-1"
          >
            {cat.label}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Browse Categories Section ──────────────────────────────────────────── */
export default function BrowseCategories() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section
      ref={ref}
      className="relative py-10 sm:py-14 lg:py-18 px-3 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #060606 0%, #0a0908 40%, #080706 100%)',
      }}
    >
      {/* ── Ambient background glows ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(201, 169, 110, 0.06) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[250px] h-[250px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(244, 194, 194, 0.04) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-6 sm:mb-10"
        >
          {/* Premium badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/8 border border-gold-500/15 mb-3">
            <Sparkles className="w-3 h-3 text-[#f0d080] animate-pulse" />
            <span className="text-[#f0d080] text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase">
              Our Services
            </span>
          </div>

          {/* Decorative ornament */}
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-gold-500/40" />
            <span className="text-gold-500/50 text-[10px] tracking-widest">✦✧✦</span>
            <div className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-gold-500/40" />
          </div>

          <h2 className="text-base sm:text-2xl lg:text-3xl font-display font-bold text-white uppercase tracking-[0.08em] leading-tight">
            Explore Our
            <br />
            <span className="text-gold-gradient">Decoration Categories</span>
          </h2>

          <p className="text-[10px] sm:text-sm text-white/40 mt-2.5 max-w-md mx-auto tracking-wide">
            Choose the perfect decoration for your special occasion
          </p>

          {/* Underline glow */}
          <div className="mt-3 flex justify-center">
            <div
              className="w-16 sm:w-24 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.5), transparent)',
              }}
            />
          </div>
        </motion.div>

        {/* ── 3×3 Category Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5"
        >
          {BROWSE_CATEGORIES.map((cat) => (
            <BrowseCategoryCard key={cat.slug} cat={cat} />
          ))}
        </motion.div>

        {/* ── Trust Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-gold-500/10"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="flex items-center gap-2 sm:gap-2.5">
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(201, 169, 110, 0.08)',
                    border: '1px solid rgba(201, 169, 110, 0.15)',
                  }}
                >
                  <span className="text-xs sm:text-sm">{item.icon}</span>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[11px] font-semibold text-white/80 leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[7px] sm:text-[9px] text-white/35 leading-tight">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
