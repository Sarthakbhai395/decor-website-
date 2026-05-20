'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, ArrowRight, Clock, Users, Phone } from 'lucide-react';
import { IService } from '@/types';
import { formatCurrency, getDiscountPercentage } from '@/lib/utils';
import api from '@/lib/axios';
import ServiceCardSkeleton from '@/components/shared/ServiceCardSkeleton';

export default function FeaturedServices() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/services/featured');
        setServices(data.data?.length ? data.data : FALLBACK_SERVICES);
      } catch {
        setServices(FALLBACK_SERVICES);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-luxury-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">Most Popular</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            Featured <span className="text-gold-gradient">Experiences</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Services Grid — single fade-in wrapper, no per-card stagger */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-center mt-10 sm:mt-12"
        >
          <Link href="/services">
            <button className="btn-luxury flex items-center gap-2 mx-auto active:scale-95 transition-transform duration-150">
              View All Services
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: IService }) {
  const discount = service.discountedPrice
    ? getDiscountPercentage(service.price, service.discountedPrice)
    : 0;

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = 'tel:+919999999999';
  };

  return (
    <Link href={`/services/${service.slug}`}>
      <div className="luxury-card group cursor-pointer h-full hover:-translate-y-1 transition-transform duration-200">
        {/* Image */}
        <div className="relative h-48 sm:h-52 overflow-hidden rounded-t-2xl">
          <img
            src={service.images[0]?.url || 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=75&auto=format'}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {discount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                -{discount}%
              </span>
            )}
            {service.isFeatured && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gold-gradient text-luxury-black">
                Featured
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40">
            <Star className="w-3 h-3 text-gold-500 fill-gold-500" />
            <span className="text-xs text-white font-medium">{service.rating.toFixed(1)}</span>
            <span className="text-xs text-white/50">({service.reviewCount})</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-xs text-gold-500/70 mb-1">
            {typeof service.category === 'object' ? service.category.name : ''}
          </div>
          <h3 className="text-sm font-semibold text-white group-hover:text-gold-500 transition-colors line-clamp-2 mb-3 min-h-[2.5rem]">
            {service.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{service.duration}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />Up to {service.maxGuests}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              {service.discountedPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gold-500">{formatCurrency(service.discountedPrice)}</span>
                  <span className="text-xs text-white/30 line-through">{formatCurrency(service.price)}</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gold-500">{formatCurrency(service.price)}</span>
              )}
            </div>
            {/* Call Now — button, NOT <a>, to avoid nested anchor */}
            <button
              type="button"
              onClick={handleCall}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-luxury-black relative overflow-hidden flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' }}
              aria-label="Call Now"
            >
              <Phone className="w-3 h-3" />
              <span className="hidden sm:inline">Call</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

const FALLBACK_SERVICES: IService[] = [
  {
    _id: '1', title: 'Romantic Rose Petal Surprise Setup', slug: 'romantic-rose-petal-surprise',
    description: 'A breathtaking romantic setup with thousands of rose petals', shortDescription: 'Breathtaking romantic setup',
    images: [{ url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=75&auto=format', publicId: '1' }],
    category: { _id: '1', name: 'Anniversary', slug: 'anniversary', description: '', image: { url: '', publicId: '' }, icon: '💑', isActive: true, order: 1 },
    cities: [], price: 8999, discountedPrice: 6999, duration: '3-4 hours', maxGuests: 2,
    includes: [], excludes: [], highlights: [], rating: 4.9, reviewCount: 234,
    isActive: true, isFeatured: true, tags: [], createdAt: new Date().toISOString(),
  },
  {
    _id: '2', title: 'Luxury Birthday Balloon Decoration', slug: 'luxury-birthday-balloon',
    description: 'Premium balloon decoration for birthdays', shortDescription: 'Premium balloon decoration',
    images: [{ url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=75&auto=format', publicId: '2' }],
    category: { _id: '2', name: 'Birthday', slug: 'birthday', description: '', image: { url: '', publicId: '' }, icon: '🎂', isActive: true, order: 2 },
    cities: [], price: 5999, discountedPrice: 4499, duration: '2-3 hours', maxGuests: 20,
    includes: [], excludes: [], highlights: [], rating: 4.8, reviewCount: 189,
    isActive: true, isFeatured: true, tags: [], createdAt: new Date().toISOString(),
  },
  {
    _id: '3', title: 'Candlelight Dinner by the Pool', slug: 'candlelight-dinner-pool',
    description: 'Intimate candlelight dinner setup', shortDescription: 'Intimate candlelight dinner',
    images: [{ url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=75&auto=format', publicId: '3' }],
    category: { _id: '3', name: 'Dinner', slug: 'dinner', description: '', image: { url: '', publicId: '' }, icon: '🕯️', isActive: true, order: 3 },
    cities: [], price: 12999, duration: '4-5 hours', maxGuests: 2,
    includes: [], excludes: [], highlights: [], rating: 5.0, reviewCount: 156,
    isActive: true, isFeatured: true, tags: [], createdAt: new Date().toISOString(),
  },
  {
    _id: '4', title: 'Dream Proposal Setup', slug: 'dream-proposal-setup',
    description: 'Make your proposal unforgettable', shortDescription: 'Unforgettable proposal setup',
    images: [{ url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=75&auto=format', publicId: '4' }],
    category: { _id: '4', name: 'Proposal', slug: 'proposal', description: '', image: { url: '', publicId: '' }, icon: '💍', isActive: true, order: 4 },
    cities: [], price: 15999, discountedPrice: 12999, duration: '3-4 hours', maxGuests: 2,
    includes: [], excludes: [], highlights: [], rating: 4.9, reviewCount: 98,
    isActive: true, isFeatured: true, tags: [], createdAt: new Date().toISOString(),
  },
];
