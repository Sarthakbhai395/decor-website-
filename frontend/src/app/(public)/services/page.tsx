'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, X, Star, ChevronDown,
  Phone, ArrowRight, Clock, Users, Wifi, WifiOff,
} from 'lucide-react';
import Link from 'next/link';
import { IService, ICategory, ICity, ServiceFilters } from '@/types';
import { formatCurrency, getDiscountPercentage } from '@/lib/utils';
import api from '@/lib/axios';
import ServiceCardSkeleton from '@/components/shared/ServiceCardSkeleton';

// ─── Static date — same on server and client ──────────────────────────────────
const STATIC_DATE = '2024-01-01T00:00:00.000Z';

// ─── Fallback data ────────────────────────────────────────────────────────────
const FALLBACK_CATEGORIES: ICategory[] = [
  { _id: '1', name: 'Anniversary',  slug: 'anniversary',  description: '', image: { url: '', publicId: '' }, icon: '💑', isActive: true, order: 1 },
  { _id: '2', name: 'Birthday',     slug: 'birthday',     description: '', image: { url: '', publicId: '' }, icon: '🎂', isActive: true, order: 2 },
  { _id: '3', name: 'Proposal',     slug: 'proposal',     description: '', image: { url: '', publicId: '' }, icon: '💍', isActive: true, order: 3 },
  { _id: '4', name: 'Wedding',      slug: 'wedding',      description: '', image: { url: '', publicId: '' }, icon: '👰', isActive: true, order: 4 },
  { _id: '5', name: 'Dinner',       slug: 'dinner',       description: '', image: { url: '', publicId: '' }, icon: '🕯️', isActive: true, order: 5 },
  { _id: '6', name: 'Baby Shower',  slug: 'baby-shower',  description: '', image: { url: '', publicId: '' }, icon: '👶', isActive: true, order: 6 },
];

const FALLBACK_CITIES: ICity[] = [
  { _id: '1', name: 'Delhi NCR',  slug: 'delhi-ncr',  state: 'Delhi',       image: { url: '', publicId: '' }, isActive: true, serviceCount: 120 },
  { _id: '2', name: 'Noida',      slug: 'noida',      state: 'UP',          image: { url: '', publicId: '' }, isActive: true, serviceCount: 95 },
  { _id: '3', name: 'Gurgaon',    slug: 'gurgaon',    state: 'Haryana',     image: { url: '', publicId: '' }, isActive: true, serviceCount: 88 },
  { _id: '4', name: 'Faridabad',  slug: 'faridabad',  state: 'Haryana',     image: { url: '', publicId: '' }, isActive: true, serviceCount: 60 },
];

const FALLBACK_SERVICES: IService[] = [
  {
    _id: '1', title: 'Romantic Rose Petal Surprise Setup', slug: 'romantic-rose-petal-surprise',
    description: 'A breathtaking romantic setup with thousands of fresh rose petals, candles, and fairy lights.',
    shortDescription: 'Breathtaking romantic setup with rose petals',
    images: [{ url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', publicId: '1' }],
    category: FALLBACK_CATEGORIES[0], cities: [], price: 8999, discountedPrice: 6999,
    duration: '3-4 hours', maxGuests: 2, includes: [], excludes: [], highlights: [],
    rating: 4.9, reviewCount: 234, isActive: true, isFeatured: true, tags: [], createdAt: STATIC_DATE,
  },
  {
    _id: '2', title: 'Luxury Birthday Balloon Decoration', slug: 'luxury-birthday-balloon',
    description: 'Premium balloon decoration with custom themes, LED lights, and personalized banners.',
    shortDescription: 'Premium balloon decoration for birthdays',
    images: [{ url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80', publicId: '2' }],
    category: FALLBACK_CATEGORIES[1], cities: [], price: 5999, discountedPrice: 4499,
    duration: '2-3 hours', maxGuests: 20, includes: [], excludes: [], highlights: [],
    rating: 4.8, reviewCount: 189, isActive: true, isFeatured: true, tags: [], createdAt: STATIC_DATE,
  },
  {
    _id: '3', title: 'Dream Proposal Setup', slug: 'dream-proposal-setup',
    description: 'Make your proposal unforgettable with a stunning setup of flowers, candles, and personalized decorations.',
    shortDescription: 'Unforgettable proposal setup',
    images: [{ url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80', publicId: '3' }],
    category: FALLBACK_CATEGORIES[2], cities: [], price: 15999, discountedPrice: 12999,
    duration: '3-4 hours', maxGuests: 2, includes: [], excludes: [], highlights: [],
    rating: 4.9, reviewCount: 98, isActive: true, isFeatured: true, tags: [], createdAt: STATIC_DATE,
  },
  {
    _id: '4', title: 'Candlelight Dinner by the Pool', slug: 'candlelight-dinner-pool',
    description: 'An intimate candlelight dinner setup by the pool with floating candles and rose petals.',
    shortDescription: 'Intimate candlelight dinner setup',
    images: [{ url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', publicId: '4' }],
    category: FALLBACK_CATEGORIES[4], cities: [], price: 12999,
    duration: '4-5 hours', maxGuests: 2, includes: [], excludes: [], highlights: [],
    rating: 5.0, reviewCount: 156, isActive: true, isFeatured: true, tags: [], createdAt: STATIC_DATE,
  },
  {
    _id: '5', title: 'Grand Wedding Decoration Package', slug: 'grand-wedding-decoration',
    description: 'Complete wedding decoration with floral arrangements, mandap setup, and premium lighting.',
    shortDescription: 'Complete wedding decoration package',
    images: [{ url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', publicId: '5' }],
    category: FALLBACK_CATEGORIES[3], cities: [], price: 49999, discountedPrice: 39999,
    duration: '8-10 hours', maxGuests: 200, includes: [], excludes: [], highlights: [],
    rating: 4.7, reviewCount: 67, isActive: true, isFeatured: false, tags: [], createdAt: STATIC_DATE,
  },
  {
    _id: '6', title: 'Baby Shower Decoration', slug: 'baby-shower-decoration',
    description: 'Adorable baby shower setup with pastel balloons, floral arrangements, and custom banners.',
    shortDescription: 'Adorable baby shower setup',
    images: [{ url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', publicId: '6' }],
    category: FALLBACK_CATEGORIES[5], cities: [], price: 7999, discountedPrice: 5999,
    duration: '2-3 hours', maxGuests: 30, includes: [], excludes: [], highlights: [],
    rating: 4.8, reviewCount: 112, isActive: true, isFeatured: false, tags: [], createdAt: STATIC_DATE,
  },
  {
    _id: '7', title: 'Hotel Room Romantic Surprise', slug: 'hotel-room-romantic-surprise',
    description: 'Transform any hotel room into a romantic paradise with rose petals, candles, and personalized touches.',
    shortDescription: 'Hotel room romantic transformation',
    images: [{ url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', publicId: '7' }],
    category: FALLBACK_CATEGORIES[0], cities: [], price: 9999, discountedPrice: 7999,
    duration: '2-3 hours', maxGuests: 2, includes: [], excludes: [], highlights: [],
    rating: 4.9, reviewCount: 203, isActive: true, isFeatured: true, tags: [], createdAt: STATIC_DATE,
  },
  {
    _id: '8', title: 'Anniversary Surprise Picnic', slug: 'anniversary-surprise-picnic',
    description: 'A luxurious outdoor picnic setup with premium hamper, fairy lights, and personalized decorations.',
    shortDescription: 'Luxurious outdoor anniversary picnic',
    images: [{ url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80', publicId: '8' }],
    category: FALLBACK_CATEGORIES[0], cities: [], price: 6999,
    duration: '3-4 hours', maxGuests: 2, includes: [], excludes: [], highlights: [],
    rating: 4.6, reviewCount: 78, isActive: true, isFeatured: false, tags: [], createdAt: STATIC_DATE,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const [services, setServices]     = useState<IService[]>([]);
  const [categories, setCategories] = useState<ICategory[]>(FALLBACK_CATEGORIES);
  const [cities, setCities]         = useState<ICity[]>(FALLBACK_CITIES);
  const [loading, setLoading]       = useState(true);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isOffline, setIsOffline]   = useState(false);
  const [filters, setFilters]       = useState<ServiceFilters>({
    sort: 'createdAt', order: 'desc', limit: 12,
  });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries({ ...filters, page }).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.append(k, String(v));
      });
      const { data } = await api.get(`/services?${params}`);
      setServices(data.data?.length ? data.data : FALLBACK_SERVICES);
      setTotal(data.pagination?.total || data.data?.length || FALLBACK_SERVICES.length);
      setIsOffline(false);
    } catch {
      setServices(FALLBACK_SERVICES);
      setTotal(FALLBACK_SERVICES.length);
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([api.get('/categories'), api.get('/cities')]);
        if (catRes.data.data?.length) setCategories(catRes.data.data);
        if (cityRes.data.data?.length) setCities(cityRes.data.data);
      } catch { /* keep fallback */ }
    };
    fetchMeta();
  }, []);

  const updateFilter = (key: keyof ServiceFilters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ sort: 'createdAt', order: 'desc', limit: 12 });
    setPage(1);
  };

  const displayedServices = isOffline
    ? FALLBACK_SERVICES.filter((s) => {
        if (filters.search) {
          const q = filters.search.toLowerCase();
          if (!s.title.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q)) return false;
        }
        if (filters.category && s.category._id !== filters.category) return false;
        if (filters.maxPrice && s.price > filters.maxPrice) return false;
        if (filters.rating && s.rating < filters.rating) return false;
        return true;
      })
    : services;

  const totalPages = Math.ceil((isOffline ? displayedServices.length : total) / (filters.limit || 12));

  return (
    <div className="min-h-screen bg-luxury-black pt-24">
      {/* Header */}
      <div className="bg-luxury-dark border-b border-gold-500/10 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">All Services</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
              Luxury <span className="text-gold-gradient">Experiences</span>
            </h1>
            <p className="text-white/50 max-w-2xl mx-auto text-sm sm:text-base">
              Discover our complete collection of premium decoration and surprise planning services.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Offline banner */}
        <AnimatePresence>
          {isOffline && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm mb-6"
            >
              <WifiOff className="w-4 h-4 flex-shrink-0" />
              <span>Backend offline — showing sample services.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-3 mb-8">
          {/* Search input — suppressHydrationWarning prevents fdprocessedid mismatch */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Search services..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-all"
            />
          </div>

          <div className="flex gap-3">
            {/* Sort select */}
            <div className="relative flex-1">
              <select
                suppressHydrationWarning
                value={`${filters.sort}-${filters.order}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  updateFilter('sort', sort);
                  updateFilter('order', order as 'asc' | 'desc');
                }}
                className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold-500/50 transition-all cursor-pointer"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all flex-shrink-0 ${
                showFilters
                  ? 'bg-gold-500/10 border-gold-500/50 text-gold-500'
                  : 'bg-white/5 border-white/10 text-white/70 hover:border-gold-500/30'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="luxury-card p-5 sm:p-6 mb-8 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Category</label>
                  <select
                    suppressHydrationWarning
                    value={filters.category || ''}
                    onChange={(e) => updateFilter('category', e.target.value || undefined)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/50"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">City</label>
                  <select
                    suppressHydrationWarning
                    value={filters.city || ''}
                    onChange={(e) => updateFilter('city', e.target.value || undefined)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/50"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city._id}>{city.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                    Max Price: {filters.maxPrice ? formatCurrency(filters.maxPrice) : 'Any'}
                  </label>
                  <input
                    suppressHydrationWarning
                    type="range" min="0" max="50000" step="500"
                    value={filters.maxPrice || 50000}
                    onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                    className="w-full accent-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Min Rating</label>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 3, 4, 4.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => updateFilter('rating', r || undefined)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
                          filters.rating === r
                            ? 'bg-gold-500/20 border border-gold-500/50 text-gold-500'
                            : 'bg-white/5 border border-white/10 text-white/50 hover:border-gold-500/30'
                        }`}
                      >
                        {r === 0 ? 'All' : <><Star className="w-3 h-3 fill-current" />{r}+</>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 mt-4 transition-colors"
              >
                <X className="w-3 h-3" /> Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-white/50">
            {loading
              ? 'Loading...'
              : `${isOffline ? displayedServices.length : total} services found${isOffline ? ' (sample data)' : ''}`}
          </p>
          {!isOffline && !loading && (
            <div className="flex items-center gap-1.5 text-xs text-green-400">
              <Wifi className="w-3 h-3" />
              <span>Live</span>
            </div>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : displayedServices.map((service, i) => (
                <ServiceCard key={service._id} service={service} index={i} />
              ))}
        </div>

        {/* Empty state */}
        {!loading && displayedServices.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-white mb-2">No services found</h3>
            <p className="text-white/50 text-sm mb-6">Try adjusting your filters or search term</p>
            <button onClick={clearFilters} className="btn-luxury text-sm px-6 py-2">Clear Filters</button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-xl text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >‹</button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                  p === page ? 'bg-gold-gradient text-luxury-black font-bold' : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >{p}</button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-xl text-sm font-medium bg-white/5 text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >›</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ service, index }: { service: IService; index: number }) {
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
      <div className="luxury-card group cursor-pointer h-full flex flex-col hover:-translate-y-1 transition-transform duration-200">
        {/* Image */}
        <div className="relative h-48 sm:h-52 overflow-hidden rounded-t-2xl flex-shrink-0">
          <img
            src={service.images[0]?.url || 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=75&auto=format'}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading={index < 4 ? 'eager' : 'lazy'}
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {discount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">-{discount}%</span>
            )}
            {service.isFeatured && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gold-gradient text-luxury-black">✨ Featured</span>
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
        <div className="p-4 flex flex-col flex-1">
          <div className="text-xs text-gold-500/70 mb-1">
            {typeof service.category === 'object' ? `${service.category.icon} ${service.category.name}` : ''}
          </div>
          <h3 className="text-sm font-semibold text-white group-hover:text-gold-500 transition-colors line-clamp-2 mb-3 flex-1">
            {service.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{service.duration}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />Up to {service.maxGuests}</span>
          </div>
          <div className="flex items-center justify-between mt-auto">
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
            {/* button NOT <a> — avoids nested anchor inside <Link> */}
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
