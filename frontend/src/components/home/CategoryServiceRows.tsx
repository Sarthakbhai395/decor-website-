'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// ─── All static service data ──────────────────────────────────────────────────
export const ALL_STATIC_SERVICES = [
  // Birthday
  { id: 'b1', slug: 'pastel-rose-gold-birthday', title: 'Pastel & Rose Gold Birthday Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80&auto=format', price: 2999, rating: 5, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday Decorations' },
  { id: 'b2', slug: 'delight-birthday-decor', title: 'Delight Birthday Decor', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80&auto=format', price: 2188, rating: 4.5, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday Decorations' },
  { id: 'b3', slug: 'blue-birthday-bliss', title: 'Blue Birthday Bliss Balloon Decor', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80&auto=format', price: 3124, rating: 5, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday Decorations' },
  { id: 'b4', slug: 'elegant-birthday-decoration', title: 'Elegant Birthday Decoration', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=80&auto=format', price: 3249, rating: 5, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday Decorations' },
  // Kids
  { id: 'k1', slug: 'rainbow-themed-birthday', title: 'Rainbow Themed Birthday Decor', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80&auto=format', price: 6874, rating: 5, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids Decoration' },
  { id: 'k2', slug: 'mickey-minnie-kids-decor', title: 'Mickey-Minnie Mouse Kids Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80&auto=format', price: 7499, rating: 5, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids Decoration' },
  { id: 'k3', slug: 'candy-land-themed-decor', title: 'Delightful Candy Land Themed Decor', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80&auto=format', price: 5374, rating: 5, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids Decoration' },
  { id: 'k4', slug: 'adorable-barbie-themed', title: 'Adorable Barbie Themed Decor', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80&auto=format', price: 10624, rating: 4.6, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids Decoration' },
  // Candlelight
  { id: 'c1', slug: 'private-dining-experience', title: 'Private Dining Experience', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80&auto=format', price: 6874, rating: 5, location: 'Sector 104, Noida', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
  { id: 'c2', slug: 'rooftop-candlelight-dinner', title: 'Rooftop Candlelight Dinner', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&q=80&auto=format', price: 6875, rating: 4.5, location: 'Sector 27, Gurgaon', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
  { id: 'c3', slug: 'lavish-indoor-dining', title: 'Lavish Indoor Dining', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80&auto=format', price: 7499, rating: 5, location: 'Sector 29, Gurgaon', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
  { id: 'c4', slug: 'fairy-lights-lantern-dinner', title: 'Fairy Lights & Lantern Dinner', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80&auto=format', price: 3249, rating: 5, location: 'At Your Location', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
  // Anniversary
  { id: 'a1', slug: 'rose-gold-romance-room', title: 'Rose Gold Romance Room Decor', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80&auto=format', price: 3249, rating: 5, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary Decoration' },
  { id: 'a2', slug: 'golden-glam-anniversary', title: 'Golden Glam Anniversary Bash', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80&auto=format', price: 2499, rating: 5, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary Decoration' },
  { id: 'a3', slug: 'pink-silver-anniversary', title: 'Pink & Silver Anniversary Decor', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80&auto=format', price: 2749, rating: 5, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary Decoration' },
  { id: 'a4', slug: 'i-love-you-balloons-blooms', title: 'I Love You Balloons & Blooms', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80&auto=format', price: 2749, rating: 5, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary Decoration' },
  // Ring
  { id: 'r1', slug: 'dream-proposal-ring-setup', title: 'Dream Proposal Ring Setup', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&q=80&auto=format', price: 12999, rating: 5, location: 'At Your Location', category: 'ring-decoration', categoryLabel: 'Ring Decoration' },
  { id: 'r2', slug: 'floral-ring-ceremony-decor', title: 'Floral Ring Ceremony Decor', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80&auto=format', price: 8999, rating: 4.9, location: 'At Your Location', category: 'ring-decoration', categoryLabel: 'Ring Decoration' },
  { id: 'r3', slug: 'luxury-ring-presentation', title: 'Luxury Ring Presentation Setup', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80&auto=format', price: 15999, rating: 5, location: 'At Your Location', category: 'ring-decoration', categoryLabel: 'Ring Decoration' },
  { id: 'r4', slug: 'intimate-ring-surprise', title: 'Intimate Ring Surprise', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80&auto=format', price: 6999, rating: 4.8, location: 'At Your Location', category: 'ring-decoration', categoryLabel: 'Ring Decoration' },
  // Sequin
  { id: 's1', slug: 'silver-sequin-backdrop', title: 'Silver Sequin Backdrop Setup', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80&auto=format', price: 4999, rating: 5, location: 'At Your Location', category: 'sequin-decoration', categoryLabel: 'Sequin Decoration' },
  { id: 's2', slug: 'gold-sequin-birthday', title: 'Gold Sequin Birthday Surprise', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=80&auto=format', price: 5499, rating: 4.9, location: 'At Your Location', category: 'sequin-decoration', categoryLabel: 'Sequin Decoration' },
  { id: 's3', slug: 'rose-gold-sequin-decor', title: 'Rose Gold Sequin Decor', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80&auto=format', price: 5999, rating: 5, location: 'At Your Location', category: 'sequin-decoration', categoryLabel: 'Sequin Decoration' },
  { id: 's4', slug: 'multicolor-sequin-party', title: 'Multicolor Sequin Party Setup', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80&auto=format', price: 4499, rating: 4.8, location: 'At Your Location', category: 'sequin-decoration', categoryLabel: 'Sequin Decoration' },
];

const CATEGORY_ROWS = [
  { title: 'Birthday Decorations', slug: 'birthday-decorations' },
  { title: 'Kids Decoration',       slug: 'kids-decoration' },
  { title: 'Candlelight Dinner',    slug: 'candlelight-dinner' },
  { title: 'Anniversary Decoration',slug: 'anniversary-decorations' },
  { title: 'Ring Decoration',       slug: 'ring-decoration' },
  { title: 'Sequin Decoration',     slug: 'sequin-decoration' },
];

// ─── Card ─────────────────────────────────────────────────────────────────────
export function StaticServiceCard({ service }: { service: typeof ALL_STATIC_SERVICES[0] }) {
  return (
    <Link href={`/services/${service.slug}`}>
      <div className="luxury-card group cursor-pointer h-full hover:-translate-y-1 transition-transform duration-200">
        {/* Image */}
        <div className="relative h-44 overflow-hidden rounded-t-2xl">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          {/* Rating badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 border border-gold-500/30">
            <span className="text-[10px] text-white/80 font-medium">
              {service.location === 'At Your Location' ? 'At Your Location' : service.location}
            </span>
            <span className="text-[10px] text-gold-500 font-bold ml-1">| {service.rating}★</span>
          </div>
        </div>
        {/* Content */}
        <div className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-2 mb-1.5 min-h-[2.5rem]">
            {service.title}
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-white/40 mb-2">
            <MapPin className="w-3 h-3 text-gold-500/60 flex-shrink-0" />
            <span className="truncate">{service.location}</span>
          </div>
          <p className="text-sm font-bold text-gold-500">{formatCurrency(service.price)}</p>
        </div>
      </div>
    </Link>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────
function CategoryRow({ row }: { row: typeof CATEGORY_ROWS[0] }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const services = ALL_STATIC_SERVICES.filter((s) => s.category === row.slug);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="mb-12 sm:mb-16"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white">{row.title}</h2>
        <Link
          href={`/services?category=${row.slug}`}
          className="flex items-center gap-1 text-xs sm:text-sm text-gold-500 hover:text-gold-400 transition-colors font-medium"
        >
          See All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4-column grid — equal width, aligned */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {services.map((service) => (
          <StaticServiceCard key={service.id} service={service} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CategoryServiceRows() {
  return (
    <section className="py-10 sm:py-14 bg-luxury-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {CATEGORY_ROWS.map((row) => (
          <CategoryRow key={row.slug} row={row} />
        ))}
      </div>
    </section>
  );
}
