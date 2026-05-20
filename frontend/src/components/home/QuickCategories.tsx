'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const QUICK_CATS = [
  {
    label: 'Car Decor',
    slug: 'car-decoration',
    emoji: '🚗',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&q=75&auto=format',
    ring: 'rgba(96,165,250,0.7)',   // blue
  },
  {
    label: 'Candlelight Dinner',
    slug: 'candlelight-dinner',
    emoji: '🕯️',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=75&auto=format',
    ring: 'rgba(251,191,36,0.7)',   // amber
  },
  {
    label: 'Proposal',
    slug: 'ring-decoration',
    emoji: '💍',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=200&q=75&auto=format',
    ring: 'rgba(244,114,182,0.7)',  // pink
  },
  {
    label: 'Birthday',
    slug: 'birthday-decorations',
    emoji: '🎂',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&q=75&auto=format',
    ring: 'rgba(167,139,250,0.7)',  // purple
  },
  {
    label: 'Anniversary',
    slug: 'anniversary-decorations',
    emoji: '💑',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&q=75&auto=format',
    ring: 'rgba(251,113,133,0.7)',  // rose
  },
  {
    label: 'Kids Decor',
    slug: 'kids-decoration',
    emoji: '🎈',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=75&auto=format',
    ring: 'rgba(250,204,21,0.7)',   // yellow
  },
  {
    label: 'Wedding',
    slug: 'wedding-decoration',
    emoji: '💒',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=75&auto=format',
    ring: 'rgba(248,113,113,0.7)',  // red
  },
  {
    label: 'Surprise',
    slug: 'surprise-decoration',
    emoji: '🎁',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=200&q=75&auto=format',
    ring: 'rgba(52,211,153,0.7)',   // emerald
  },
  {
    label: 'Corporate',
    slug: 'corporate-decoration',
    emoji: '🏢',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=75&auto=format',
    ring: 'rgba(148,163,184,0.7)',  // slate
  },
];

/* ─── Single circular category pill ─────────────────────────────────────── */
function CategoryCircle({
  cat,
  index,
  inView,
}: {
  cat: (typeof QUICK_CATS)[0];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.88 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.38,
        delay: index * 0.055,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/categories/${cat.slug}`}>
        <div className="flex flex-col items-center gap-2 group cursor-pointer select-none">

          {/* ── Circle ── */}
          <div
            className="relative rounded-full overflow-hidden active:scale-90 transition-transform duration-150"
            /* Responsive size: 72 px on 320 px screens → 88 px on 414 px+ */
            style={{
              width: 'clamp(68px, 19vw, 88px)',
              height: 'clamp(68px, 19vw, 88px)',
              /* Double-ring: gold outer + colour inner */
              boxShadow: `0 0 0 2.5px rgba(201,169,110,0.55), 0 0 0 5px ${cat.ring}, 0 6px 18px rgba(0,0,0,0.45)`,
            }}
          >
            {/* Photo */}
            <img
              src={cat.image}
              alt={cat.label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/65" />

            {/* Glassmorphism shimmer on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, rgba(201,169,110,0.18) 0%, transparent 60%)',
              }}
            />

            {/* Emoji badge — top-left */}
            <div
              className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] leading-none"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            >
              {cat.emoji}
            </div>
          </div>

          {/* ── Label ── */}
          <p
            className="text-center font-semibold text-white/80 group-hover:text-gold-400 transition-colors leading-tight"
            style={{ fontSize: 'clamp(9px, 2.4vw, 11px)', maxWidth: 'clamp(68px, 19vw, 88px)' }}
          >
            {cat.label}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */
export default function QuickCategories() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section
      ref={ref}
      className="bg-luxury-black border-b border-gold-500/10"
      style={{ paddingTop: '18px', paddingBottom: '20px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="text-[10px] sm:text-xs text-gold-500/60 uppercase tracking-widest font-medium mb-4 sm:mb-5 text-center sm:text-left"
        >
          Browse Categories
        </motion.p>

        {/* ── Mobile: 3 × 3 grid ── */}
        <div className="grid grid-cols-3 gap-y-5 gap-x-2 sm:hidden">
          {QUICK_CATS.map((cat, i) => (
            <div key={cat.slug} className="flex justify-center">
              <CategoryCircle cat={cat} index={i} inView={inView} />
            </div>
          ))}
        </div>

        {/* ── Desktop: 9-column row ── */}
        <div className="hidden sm:grid grid-cols-9 gap-3 lg:gap-4">
          {QUICK_CATS.map((cat, i) => (
            <div key={cat.slug} className="flex justify-center">
              <CategoryCircle cat={cat} index={i} inView={inView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
