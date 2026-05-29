'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, Star, MapPin, Phone, MessageCircle, Sparkles, Tag, Filter } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const PHONE = '+916306059912';
const WA = '916306059912';
const MAX_PRICE = 2499;

/* ─── Types ────────────────────────────────────────────────────────────────── */
type ServiceItem = {
  id: string; slug: string; title: string; image: string;
  price: number; rating: number; location: string;
  category: string; categoryLabel: string;
};

/* ─── All services from all categories (master data) ───────────────────────── */
const ALL_SERVICES: ServiceItem[] = [
  // Birthday
  { id: 'b1', slug: 'pastel-rose-gold-birthday', title: 'Pastel & Rose Gold Birthday Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 2999, rating: 5, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
  { id: 'b2', slug: 'delight-birthday-decor', title: 'Delight Birthday Decor', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80', price: 2188, rating: 4.5, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
  { id: 'b3', slug: 'blue-birthday-bliss', title: 'Blue Birthday Bliss Balloon Decor', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 3124, rating: 5, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
  { id: 'b4', slug: 'elegant-birthday-decoration', title: 'Elegant Birthday Decoration', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=80', price: 3249, rating: 5, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
  { id: 'b5', slug: 'golden-birthday-setup', title: 'Golden Glam Birthday Setup', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80', price: 3799, rating: 4.8, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
  { id: 'b6', slug: 'fairy-tale-birthday', title: 'Fairy Tale Birthday Decoration', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 4299, rating: 4.9, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
  { id: 'b9', slug: 'superhero-birthday-decor', title: 'Superhero Birthday Decoration', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=80', price: 2799, rating: 4.6, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
  // Anniversary
  { id: 'a1', slug: 'rose-gold-romance-room', title: 'Rose Gold Romance Room Decor', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 3249, rating: 5, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
  { id: 'a2', slug: 'golden-glam-anniversary', title: 'Golden Glam Anniversary Bash', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 2499, rating: 5, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
  { id: 'a3', slug: 'pink-silver-anniversary', title: 'Pink & Silver Anniversary Decor', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80', price: 2749, rating: 5, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
  { id: 'a4', slug: 'i-love-you-balloons-blooms', title: 'I Love You Balloons & Blooms', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80', price: 2749, rating: 5, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
  // Candlelight
  { id: 'c1', slug: 'private-dining-experience', title: 'Private Dining Experience', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80', price: 6874, rating: 5, location: 'Sector 104, Noida', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
  { id: 'c4', slug: 'fairy-lights-lantern-dinner', title: 'Fairy Lights & Lantern Dinner', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80', price: 3249, rating: 5, location: 'At Your Location', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
  // Kids
  { id: 'k1', slug: 'rainbow-themed-birthday', title: 'Rainbow Themed Birthday Decor', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80', price: 6874, rating: 5, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids' },
  { id: 'k3', slug: 'candy-land-themed-decor', title: 'Delightful Candy Land Themed Decor', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 5374, rating: 5, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids' },
  { id: 'k7', slug: 'dinosaur-kids-theme', title: 'Dinosaur Kids Theme Decoration', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 4999, rating: 4.7, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids' },
  // Ring / Proposal
  { id: 'r4', slug: 'intimate-ring-surprise', title: 'Intimate Ring Surprise', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 6999, rating: 4.8, location: 'At Your Location', category: 'ring-decoration', categoryLabel: 'Proposal' },
  // Car Decoration
  { id: 'cd1', slug: 'romantic-car-decoration', title: 'Romantic Car Decoration', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80', price: 1999, rating: 4.8, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
  { id: 'cd2', slug: 'anniversary-car-decor', title: 'Anniversary Car Decor', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', price: 2499, rating: 4.9, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
  { id: 'cd3', slug: 'birthday-car-surprise', title: 'Birthday Car Surprise', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&q=80', price: 1799, rating: 4.7, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
  { id: 'cd4', slug: 'luxury-car-floral-decor', title: 'Luxury Car Floral Decor', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80', price: 3499, rating: 5, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
  { id: 'cd7', slug: 'balloon-car-decor', title: 'Balloon Car Decoration', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80', price: 1499, rating: 4.6, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
  { id: 'cd8', slug: 'rose-petal-car-decor', title: 'Rose Petal Car Decoration', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', price: 2999, rating: 4.8, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
  // Surprise
  { id: 'sd1', slug: 'midnight-surprise-setup', title: 'Midnight Surprise Setup', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 3999, rating: 4.9, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise' },
  { id: 'sd3', slug: 'balloon-surprise-setup', title: 'Balloon Surprise Setup', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 2999, rating: 4.8, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise' },
  { id: 'sd5', slug: 'birthday-surprise-room', title: 'Birthday Surprise Room Decor', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 4499, rating: 4.8, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise' },
  { id: 'sd9', slug: 'photo-wall-surprise', title: 'Photo Wall Surprise Decoration', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 3499, rating: 4.8, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise' },
  // Wedding (lower range)
  { id: 'wd9', slug: 'haldi-ceremony-decor', title: 'Haldi Ceremony Decoration', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80', price: 9999, rating: 4.7, location: 'Faridabad', category: 'wedding-decoration', categoryLabel: 'Wedding' },
  // Corporate
  { id: 'corp5', slug: 'conference-decor', title: 'Conference Room Decoration', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 7999, rating: 4.6, location: 'At Your Location', category: 'corporate-decoration', categoryLabel: 'Corporate' },
  { id: 'corp8', slug: 'seminar-decor', title: 'Seminar & Workshop Decoration', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80', price: 6999, rating: 4.7, location: 'Noida', category: 'corporate-decoration', categoryLabel: 'Corporate' },
];

/* ─── Category filter chips ─────────────────────────────────────────────────── */
const CATEGORY_FILTERS = [
  { value: 'all', label: 'All', emoji: '✨' },
  { value: 'birthday-decorations', label: 'Birthday', emoji: '🎂' },
  { value: 'anniversary-decorations', label: 'Anniversary', emoji: '💑' },
  { value: 'car-decoration', label: 'Car Decor', emoji: '🚗' },
  { value: 'surprise-decoration', label: 'Surprise', emoji: '🎁' },
  { value: 'candlelight-dinner', label: 'Candlelight', emoji: '🕯️' },
  { value: 'kids-decoration', label: 'Kids', emoji: '🎈' },
  { value: 'ring-decoration', label: 'Proposal', emoji: '💍' },
  { value: 'wedding-decoration', label: 'Wedding', emoji: '💒' },
  { value: 'corporate-decoration', label: 'Corporate', emoji: '🏢' },
];

/* ─── Service Card ─────────────────────────────────────────────────────────── */
function BudgetServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const savings = MAX_PRICE - service.price;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.45, delay: (index % 6) * 0.06, ease: 'easeOut' }}
    >
      <Link href={`/services/${service.slug}`}>
        <div className="luxury-card group cursor-pointer h-full flex flex-col hover:-translate-y-1.5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(201,169,110,0.15)]">
          {/* Image */}
          <div className="relative h-44 sm:h-52 overflow-hidden rounded-t-2xl flex-shrink-0">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading={index < 4 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Rating badge */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-gold-500/30">
              <Star className="w-2.5 h-2.5 text-gold-500 fill-gold-500" />
              <span className="text-[10px] text-white font-semibold">{service.rating}</span>
            </div>

            {/* Budget badge */}
            <div
              className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                backgroundImage: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)',
                color: '#0a0a0a',
              }}
            >
              <Tag className="w-2.5 h-2.5" />
              Budget Deal
            </div>

            {/* Category label */}
            <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[9px] text-white/80 font-medium backdrop-blur-sm">
              {service.categoryLabel}
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

            <div className="flex items-center justify-between mt-auto gap-2">
              <div>
                <p className="text-sm font-bold text-gold-500">{formatCurrency(service.price)}</p>
                {savings > 0 && (
                  <p className="text-[10px] text-emerald-400 font-medium">
                    Save {formatCurrency(savings)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `tel:${PHONE}`; }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-luxury-black"
                  style={{ backgroundImage: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' }}
                  aria-label="Call Now"
                >
                  <Phone className="w-2.5 h-2.5" />
                  <span>Call</span>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I'm interested in: ${service.title} (₹${service.price})`)}`, '_blank');
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: '#25D366' }}
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-2.5 h-2.5 fill-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */
export default function BudgetDealsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter products <= MAX_PRICE
  const budgetProducts = useMemo(() => {
    return ALL_SERVICES.filter((s) => s.price <= MAX_PRICE);
  }, []);

  // Apply category filter
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return budgetProducts;
    return budgetProducts.filter((s) => s.category === activeCategory);
  }, [activeCategory, budgetProducts]);

  // Get categories that actually have budget products
  const availableCategories = useMemo(() => {
    const cats = new Set(budgetProducts.map((s) => s.category));
    return CATEGORY_FILTERS.filter((f) => f.value === 'all' || cats.has(f.value));
  }, [budgetProducts]);

  return (
    <div className="min-h-screen bg-luxury-black pt-16 sm:pt-20">
      {/* ── Hero Banner ── */}
      <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(135deg, #1a0f00 0%, #0d0d0d 30%, #0a0a0a 60%, #1a0f00 100%)',
          }}
        />
        {/* Decorative gold circles */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #c9a96e, transparent 70%)' }}
        />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #f0d080, transparent 70%)' }}
        />

        {/* Floating sparkle particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: 'rgba(201, 169, 110, 0.5)',
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 2.5 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs text-white/60 hover:text-gold-400 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Home
              </Link>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-xs text-gold-500/80">Budget Deals</span>
            </div>

            {/* Title */}
            <div className="flex items-center gap-4 sm:gap-5">
              <motion.div
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{
                  backgroundImage: 'linear-gradient(135deg, rgba(201,169,110,0.2) 0%, rgba(240,208,128,0.1) 100%)',
                  border: '1.5px solid rgba(201,169,110,0.3)',
                }}
                animate={{ boxShadow: ['0 0 20px rgba(201,169,110,0.15)', '0 0 35px rgba(201,169,110,0.25)', '0 0 20px rgba(201,169,110,0.15)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Tag className="w-8 h-8 sm:w-10 sm:h-10 text-gold-500" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white leading-tight">
                  Decoration Under{' '}
                  <span
                    className="text-gold-gradient"
                    style={{ textShadow: '0 0 20px rgba(201,169,110,0.5)' }}
                  >
                    ₹{MAX_PRICE.toLocaleString('en-IN')}
                  </span>
                </h1>
                <p className="text-white/50 text-xs sm:text-sm mt-1.5 max-w-lg">
                  Premium decorations that don&apos;t break the bank. All services below ₹{MAX_PRICE.toLocaleString('en-IN')} across every category.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Category Filter Chips ── */}
      <div className="sticky top-14 sm:top-16 z-30 border-b border-white/5"
        style={{ backgroundColor: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            <Filter className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
            {availableCategories.map((cat) => (
              <motion.button
                key={cat.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 border ${
                  activeCategory === cat.value
                    ? 'text-luxury-black border-gold-500/50'
                    : 'text-white/60 hover:text-white border-white/10 hover:border-white/20'
                }`}
                style={
                  activeCategory === cat.value
                    ? { backgroundImage: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' }
                    : { backgroundColor: 'rgba(255,255,255,0.05)' }
                }
              >
                <span className="text-sm">{cat.emoji}</span>
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Services Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Results count */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <p className="text-sm text-white/50">
              <span className="text-white font-semibold">{filteredProducts.length}</span>{' '}
              {filteredProducts.length === 1 ? 'deal' : 'deals'} found
              {activeCategory !== 'all' && (
                <span className="text-gold-500/70">
                  {' '}in {availableCategories.find((c) => c.value === activeCategory)?.label}
                </span>
              )}
            </p>
          </div>
          <div
            className="px-2.5 py-1 rounded-full text-[10px] font-bold text-luxury-black"
            style={{ backgroundImage: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' }}
          >
            Max ₹{MAX_PRICE.toLocaleString('en-IN')}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                {filteredProducts.map((service, i) => (
                  <BudgetServiceCard key={service.id} service={service} index={i} />
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-5xl mb-4">🏷️</div>
                <h3 className="text-lg font-semibold text-white mb-2">No deals in this category</h3>
                <p className="text-white/40 text-sm mb-6">
                  Try selecting a different category or view all deals.
                </p>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="px-6 py-2.5 rounded-full text-sm font-bold text-luxury-black transition-all active:scale-95"
                  style={{ backgroundImage: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' }}
                >
                  View All Deals
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        {filteredProducts.length > 0 && (
          <motion.div
            className="mt-12 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-3xl border border-gold-500/15"
              style={{ backgroundColor: 'rgba(201, 169, 110, 0.04)' }}
            >
              <p className="text-sm text-white/60">Can&apos;t find what you need?</p>
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${PHONE}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-luxury-black transition-all active:scale-95"
                  style={{ backgroundImage: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' }}
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call for Custom Quote
                </a>
                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'm looking for decoration services under ₹2499. Can you help?")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white transition-all active:scale-95"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
