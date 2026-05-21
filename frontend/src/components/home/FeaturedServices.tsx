'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, ArrowRight, Phone, Sparkles } from 'lucide-react';
import { IService } from '@/types';
import { formatCurrency, getDiscountPercentage } from '@/lib/utils';
import api from '@/lib/axios';
import ServiceCardSkeleton from '@/components/shared/ServiceCardSkeleton';

/* ─── Marquee keyframes injected once ───────────────────────────────────── */
const MARQUEE_CSS = `
@keyframes lx-marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;

/* ─── Single card ────────────────────────────────────────────────────────── */
function FeaturedCard({ service }: { service: IService }) {
  const discount = service.discountedPrice
    ? getDiscountPercentage(service.price, service.discountedPrice)
    : 0;

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = 'tel:+916306059912';
  };

  return (
    <Link href={`/services/${service.slug}`}>
      <div
        /* Fixed width so every card is identical — no layout shift */
        className="group cursor-pointer flex-shrink-0 rounded-2xl overflow-hidden border border-gold-500/15 hover:border-gold-500/45 transition-all duration-300"
        style={{
          width: 'clamp(190px, 52vw, 240px)',
          background:
            'linear-gradient(145deg, rgba(201,169,110,0.07) 0%, rgba(10,10,10,0.96) 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: 'clamp(130px, 36vw, 160px)' }}>
          <img
            src={
              service.images[0]?.url ||
              'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=75'
            }
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {discount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-500 text-white leading-none">
                -{discount}%
              </span>
            )}
            {service.isFeatured && (
              <span
                className="px-1.5 py-0.5 rounded-full text-[9px] font-bold text-luxury-black leading-none"
                style={{
                  background: 'linear-gradient(135deg, #c9a96e, #f0d080)',
                }}
              >
                ✨ Featured
              </span>
            )}
          </div>

          {/* Rating pill */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/60">
            <Star className="w-2.5 h-2.5 text-gold-500 fill-gold-500" />
            <span className="text-[10px] text-white font-semibold">{service.rating.toFixed(1)}</span>
            <span className="text-[10px] text-white/50">({service.reviewCount})</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-3">
          <p className="text-[9px] text-gold-500/70 mb-0.5 uppercase tracking-wide">
            {typeof service.category === 'object' ? service.category.name : ''}
          </p>
          <h3 className="text-[11px] sm:text-xs font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-2 mb-2.5 leading-snug min-h-[2.2rem]">
            {service.title}
          </h3>

          {/* Price + Call */}
          <div className="flex items-center justify-between">
            <div>
              {service.discountedPrice ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-gold-500">
                    {formatCurrency(service.discountedPrice)}
                  </span>
                  <span className="text-[9px] text-white/30 line-through">
                    {formatCurrency(service.price)}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-bold text-gold-500">
                  {formatCurrency(service.price)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCall}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-luxury-black flex-shrink-0 active:scale-90 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)',
              }}
              aria-label="Call Now"
            >
              <Phone className="w-2.5 h-2.5" />
              Call
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Infinite single-row marquee ────────────────────────────────────────── */
function SingleRowMarquee({ services }: { services: IService[] }) {
  const [paused, setPaused] = useState(false);
  /* Duplicate once for seamless loop */
  const items = [...services, ...services];
  /* Speed: 1 card ≈ 3 s → total width / 2 items * 3 s */
  const speed = Math.max(services.length * 3, 18);

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        className="flex gap-3 sm:gap-4"
        style={{
          width: 'max-content',
          animation: `lx-marquee ${speed}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {items.map((s, i) => (
          <FeaturedCard key={`${s._id}-${i}`} service={s} />
        ))}
      </div>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */
export default function FeaturedServices() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  useEffect(() => {
    api
      .get('/services/featured')
      .then(({ data }) =>
        setServices(data.data?.length ? data.data : FALLBACK_SERVICES),
      )
      .catch(() => setServices(FALLBACK_SERVICES))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section ref={ref} className="py-10 sm:py-14 bg-luxury-black overflow-hidden">
      {/* Inject keyframes once */}
      <style>{MARQUEE_CSS}</style>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 sm:mb-7">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="flex items-end justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span className="text-gold-500 text-[10px] sm:text-xs font-medium tracking-widest uppercase">
                Most Popular
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-display font-bold text-white">
              Featured{' '}
              <span className="text-gold-gradient">Experiences</span>
            </h2>
          </div>

          <Link
            href="/services"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-gold-500 hover:text-gold-400 transition-colors font-medium"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>

      {/* Single-row carousel */}
      {loading ? (
        /* Skeleton row */
        <div className="flex gap-3 sm:gap-4 px-4 sm:px-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-2xl overflow-hidden"
              style={{ width: 'clamp(190px, 52vw, 240px)' }}
            >
              <ServiceCardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <SingleRowMarquee services={services} />
        </motion.div>
      )}
    </section>
  );
}

/* ─── Fallback data ──────────────────────────────────────────────────────── */
const STATIC_DATE = '2024-01-01T00:00:00.000Z';

const FALLBACK_SERVICES: IService[] = [
  {
    _id: '1',
    title: 'Romantic Rose Petal Surprise Setup',
    slug: 'romantic-rose-petal-surprise',
    description: 'A breathtaking romantic setup',
    shortDescription: 'Breathtaking romantic setup',
    images: [{ url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=75', publicId: '1' }],
    category: { _id: '1', name: 'Anniversary', slug: 'anniversary', description: '', image: { url: '', publicId: '' }, icon: '💑', isActive: true, order: 1 },
    cities: [], price: 8999, discountedPrice: 6999, duration: '3-4 hours', maxGuests: 2,
    includes: [], excludes: [], highlights: [], rating: 4.9, reviewCount: 234,
    isActive: true, isFeatured: true, tags: [], createdAt: STATIC_DATE,
  },
  {
    _id: '2',
    title: 'Luxury Birthday Balloon Decoration',
    slug: 'luxury-birthday-balloon',
    description: 'Premium balloon decoration',
    shortDescription: 'Premium balloon decoration',
    images: [{ url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=75', publicId: '2' }],
    category: { _id: '2', name: 'Birthday', slug: 'birthday', description: '', image: { url: '', publicId: '' }, icon: '🎂', isActive: true, order: 2 },
    cities: [], price: 5999, discountedPrice: 4499, duration: '2-3 hours', maxGuests: 20,
    includes: [], excludes: [], highlights: [], rating: 4.8, reviewCount: 189,
    isActive: true, isFeatured: true, tags: [], createdAt: STATIC_DATE,
  },
  {
    _id: '3',
    title: 'Candlelight Dinner by the Pool',
    slug: 'candlelight-dinner-pool',
    description: 'Intimate candlelight dinner',
    shortDescription: 'Intimate candlelight dinner',
    images: [{ url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=75', publicId: '3' }],
    category: { _id: '3', name: 'Dinner', slug: 'dinner', description: '', image: { url: '', publicId: '' }, icon: '🕯️', isActive: true, order: 3 },
    cities: [], price: 12999, duration: '4-5 hours', maxGuests: 2,
    includes: [], excludes: [], highlights: [], rating: 5.0, reviewCount: 156,
    isActive: true, isFeatured: true, tags: [], createdAt: STATIC_DATE,
  },
  {
    _id: '4',
    title: 'Dream Proposal Setup',
    slug: 'dream-proposal-setup',
    description: 'Make your proposal unforgettable',
    shortDescription: 'Unforgettable proposal setup',
    images: [{ url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=75', publicId: '4' }],
    category: { _id: '4', name: 'Proposal', slug: 'proposal', description: '', image: { url: '', publicId: '' }, icon: '💍', isActive: true, order: 4 },
    cities: [], price: 15999, discountedPrice: 12999, duration: '3-4 hours', maxGuests: 2,
    includes: [], excludes: [], highlights: [], rating: 4.9, reviewCount: 98,
    isActive: true, isFeatured: true, tags: [], createdAt: STATIC_DATE,
  },
  {
    _id: '5',
    title: 'Hotel Room Romantic Surprise',
    slug: 'hotel-room-romantic-surprise',
    description: 'Transform any hotel room',
    shortDescription: 'Hotel room romantic transformation',
    images: [{ url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=75', publicId: '5' }],
    category: { _id: '1', name: 'Anniversary', slug: 'anniversary', description: '', image: { url: '', publicId: '' }, icon: '💑', isActive: true, order: 1 },
    cities: [], price: 9999, discountedPrice: 7999, duration: '2-3 hours', maxGuests: 2,
    includes: [], excludes: [], highlights: [], rating: 4.9, reviewCount: 203,
    isActive: true, isFeatured: true, tags: [], createdAt: STATIC_DATE,
  },
  {
    _id: '6',
    title: 'Anniversary Surprise Picnic',
    slug: 'anniversary-surprise-picnic',
    description: 'Luxurious outdoor picnic',
    shortDescription: 'Luxurious outdoor anniversary picnic',
    images: [{ url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=75', publicId: '6' }],
    category: { _id: '1', name: 'Anniversary', slug: 'anniversary', description: '', image: { url: '', publicId: '' }, icon: '💑', isActive: true, order: 1 },
    cities: [], price: 6999, duration: '3-4 hours', maxGuests: 2,
    includes: [], excludes: [], highlights: [], rating: 4.6, reviewCount: 78,
    isActive: true, isFeatured: false, tags: [], createdAt: STATIC_DATE,
  },
];
