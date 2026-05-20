'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, Star, MapPin, Heart, Eye, Phone } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ALL_STATIC_SERVICES } from '@/components/home/CategoryServiceRows';

// ─── Category metadata ────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, {
  title: string;
  description: string;
  image: string;
  emoji: string;
  color: string;
}> = {
  'car-decoration': {
    title: 'Car Decoration',
    description: 'Transform your vehicle into a stunning celebration on wheels. Perfect for anniversaries, birthdays, and special occasions.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80',
    emoji: '🚗',
    color: 'from-blue-900/60',
  },
  'candlelight-dinner': {
    title: 'Candlelight Dinner',
    description: 'Intimate, romantic dining experiences crafted with premium setups, fairy lights, and exquisite floral arrangements.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
    emoji: '🕯️',
    color: 'from-amber-900/60',
  },
  'ring-decoration': {
    title: 'Proposal Decoration',
    description: 'Make your proposal unforgettable with breathtaking setups designed to capture the perfect moment.',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&q=80',
    emoji: '💍',
    color: 'from-pink-900/60',
  },
  'birthday-decorations': {
    title: 'Birthday Decoration',
    description: 'Premium birthday setups with custom themes, balloon art, and personalized touches for every age.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80',
    emoji: '🎂',
    color: 'from-purple-900/60',
  },
  'anniversary-decorations': {
    title: 'Anniversary Decoration',
    description: 'Celebrate your love story with romantic setups, rose petals, and luxury decorations that speak from the heart.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
    emoji: '💑',
    color: 'from-rose-900/60',
  },
  'kids-decoration': {
    title: 'Kids Decoration',
    description: 'Magical, colorful, and fun-filled decoration themes that bring joy and wonder to every child\'s special day.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    emoji: '🎈',
    color: 'from-yellow-900/60',
  },
  'wedding-decoration': {
    title: 'Wedding Decoration',
    description: 'Grand, elegant wedding setups with premium floral arrangements, mandap decor, and breathtaking ambiance.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    emoji: '💒',
    color: 'from-red-900/60',
  },
  'surprise-decoration': {
    title: 'Surprise Decoration',
    description: 'Carefully planned surprise setups that create unforgettable moments of joy and emotion.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
    emoji: '🎁',
    color: 'from-green-900/60',
  },
  'corporate-decoration': {
    title: 'Corporate Decoration',
    description: 'Professional, elegant event decoration for corporate gatherings, product launches, and team celebrations.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    emoji: '🏢',
    color: 'from-slate-900/60',
  },
};

// Extended static services for categories not in CategoryServiceRows
const EXTENDED_SERVICES: Record<string, typeof ALL_STATIC_SERVICES> = {
  'car-decoration': [
    { id: 'cd1', slug: 'romantic-car-decoration', title: 'Romantic Car Decoration', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80', price: 1999, rating: 4.8, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decoration' },
    { id: 'cd2', slug: 'anniversary-car-decor', title: 'Anniversary Car Decor', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', price: 2499, rating: 4.9, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decoration' },
    { id: 'cd3', slug: 'birthday-car-surprise', title: 'Birthday Car Surprise', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&q=80', price: 1799, rating: 4.7, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decoration' },
    { id: 'cd4', slug: 'luxury-car-floral-decor', title: 'Luxury Car Floral Decor', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80', price: 3499, rating: 5.0, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decoration' },
    { id: 'cd5', slug: 'wedding-car-decoration', title: 'Wedding Car Decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 4999, rating: 4.9, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decoration' },
    { id: 'cd6', slug: 'proposal-car-setup', title: 'Proposal Car Setup', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&q=80', price: 5999, rating: 5.0, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decoration' },
  ],
  'wedding-decoration': [
    { id: 'wd1', slug: 'grand-wedding-decoration', title: 'Grand Wedding Decoration Package', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80', price: 39999, rating: 4.7, location: 'At Your Location', category: 'wedding-decoration', categoryLabel: 'Wedding Decoration' },
    { id: 'wd2', slug: 'floral-wedding-mandap', title: 'Floral Wedding Mandap Setup', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80', price: 29999, rating: 4.8, location: 'At Your Location', category: 'wedding-decoration', categoryLabel: 'Wedding Decoration' },
    { id: 'wd3', slug: 'royal-wedding-decor', title: 'Royal Wedding Decor', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80', price: 49999, rating: 5.0, location: 'At Your Location', category: 'wedding-decoration', categoryLabel: 'Wedding Decoration' },
    { id: 'wd4', slug: 'intimate-wedding-setup', title: 'Intimate Wedding Setup', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 14999, rating: 4.9, location: 'At Your Location', category: 'wedding-decoration', categoryLabel: 'Wedding Decoration' },
    { id: 'wd5', slug: 'garden-wedding-decor', title: 'Garden Wedding Decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 24999, rating: 4.8, location: 'At Your Location', category: 'wedding-decoration', categoryLabel: 'Wedding Decoration' },
    { id: 'wd6', slug: 'destination-wedding-decor', title: 'Destination Wedding Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 59999, rating: 5.0, location: 'At Your Location', category: 'wedding-decoration', categoryLabel: 'Wedding Decoration' },
  ],
  'surprise-decoration': [
    { id: 'sd1', slug: 'midnight-surprise-setup', title: 'Midnight Surprise Setup', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 3999, rating: 4.9, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise Decoration' },
    { id: 'sd2', slug: 'hotel-room-surprise', title: 'Hotel Room Surprise Decor', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80', price: 7999, rating: 4.9, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise Decoration' },
    { id: 'sd3', slug: 'balloon-surprise-setup', title: 'Balloon Surprise Setup', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 2999, rating: 4.8, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise Decoration' },
    { id: 'sd4', slug: 'romantic-surprise-picnic', title: 'Romantic Surprise Picnic', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 6999, rating: 4.7, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise Decoration' },
    { id: 'sd5', slug: 'birthday-surprise-room', title: 'Birthday Surprise Room Decor', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 4499, rating: 4.8, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise Decoration' },
    { id: 'sd6', slug: 'anniversary-surprise-setup', title: 'Anniversary Surprise Setup', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80', price: 8999, rating: 5.0, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise Decoration' },
  ],
  'corporate-decoration': [
    { id: 'corp1', slug: 'corporate-event-decor', title: 'Corporate Event Decoration', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80', price: 14999, rating: 4.8, location: 'At Your Location', category: 'corporate-decoration', categoryLabel: 'Corporate Decoration' },
    { id: 'corp2', slug: 'product-launch-decor', title: 'Product Launch Decoration', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80', price: 24999, rating: 4.9, location: 'At Your Location', category: 'corporate-decoration', categoryLabel: 'Corporate Decoration' },
    { id: 'corp3', slug: 'office-party-decor', title: 'Office Party Decoration', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 9999, rating: 4.7, location: 'At Your Location', category: 'corporate-decoration', categoryLabel: 'Corporate Decoration' },
    { id: 'corp4', slug: 'award-ceremony-decor', title: 'Award Ceremony Decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 19999, rating: 4.9, location: 'At Your Location', category: 'corporate-decoration', categoryLabel: 'Corporate Decoration' },
    { id: 'corp5', slug: 'conference-decor', title: 'Conference Room Decoration', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 7999, rating: 4.6, location: 'At Your Location', category: 'corporate-decoration', categoryLabel: 'Corporate Decoration' },
    { id: 'corp6', slug: 'team-celebration-decor', title: 'Team Celebration Decoration', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 11999, rating: 4.8, location: 'At Your Location', category: 'corporate-decoration', categoryLabel: 'Corporate Decoration' },
  ],
};

// ─── Service Card ─────────────────────────────────────────────────────────────
function CategoryServiceCard({ service, index }: { service: typeof ALL_STATIC_SERVICES[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
    >
      <Link href={`/services/${service.slug}`}>
        <div className="luxury-card group cursor-pointer h-full flex flex-col hover:-translate-y-1 transition-transform duration-200">
          {/* Image */}
          <div className="relative h-44 sm:h-52 overflow-hidden rounded-t-2xl flex-shrink-0">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-108"
              loading={index < 6 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Rating badge */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-gold-500/30">
              <Star className="w-2.5 h-2.5 text-gold-500 fill-gold-500" />
              <span className="text-[10px] text-white font-semibold">{service.rating}</span>
            </div>

            {/* Wishlist */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white/60 hover:text-rose-400 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-3.5 h-3.5" />
            </button>

            {/* Quick preview */}
            <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 text-[10px] text-white/80">
                <Eye className="w-3 h-3" />
                <span>Quick View</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 flex flex-col flex-1">
            <div className="flex items-center gap-1 text-[10px] text-white/40 mb-1.5">
              <MapPin className="w-2.5 h-2.5 text-gold-500/60 flex-shrink-0" />
              <span className="truncate">{service.location}</span>
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-2 mb-2 flex-1">
              {service.title}
            </h3>
            <div className="flex items-center justify-between mt-auto">
              <p className="text-sm font-bold text-gold-500">{formatCurrency(service.price)}</p>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = 'tel:+919999999999'; }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-luxury-black"
                style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' }}
                aria-label="Call Now"
              >
                <Phone className="w-2.5 h-2.5" />
                <span>Call</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const meta = CATEGORY_META[slug] || {
    title: slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Category',
    description: 'Explore our premium decoration services for this category.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80',
    emoji: '✨',
    color: 'from-gray-900/60',
  };

  // Get services: from static map or extended
  const services = [
    ...ALL_STATIC_SERVICES.filter((s) => s.category === slug),
    ...(EXTENDED_SERVICES[slug] || []),
  ];

  // If no services found, show all static services as fallback
  const displayServices = services.length > 0 ? services : ALL_STATIC_SERVICES.slice(0, 8);

  return (
    <div className="min-h-screen bg-luxury-black pt-16 sm:pt-20">
      {/* Hero Banner */}
      <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
        <img
          src={meta.image}
          alt={meta.title}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${meta.color} via-black/50 to-black/90`} />
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-xs text-white/60 hover:text-gold-400 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-xs text-gold-500/80">Categories</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">{meta.emoji}</span>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white">
                  {meta.title}
                </h1>
                <p className="text-white/60 text-sm mt-1 max-w-xl">{meta.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-white/50">
            <span className="text-white font-semibold">{displayServices.length}</span> services available
          </p>
          <Link
            href="/services"
            className="text-xs text-gold-500 hover:text-gold-400 transition-colors flex items-center gap-1"
          >
            View all services
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {displayServices.map((service, i) => (
            <CategoryServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
