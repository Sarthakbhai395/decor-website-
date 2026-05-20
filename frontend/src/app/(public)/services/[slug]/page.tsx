'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Clock, Users, Check, X as XIcon,
  ArrowLeft, Share2, ChevronLeft, ChevronRight,
  Sparkles, Phone, ChevronDown, ChevronUp,
  MessageCircle, Copy, Twitter, Facebook,
} from 'lucide-react';
import { IService } from '@/types';
import { formatCurrency, getDiscountPercentage } from '@/lib/utils';
import api from '@/lib/axios';
import { ALL_STATIC_SERVICES } from '@/components/home/CategoryServiceRows';

// ─── Fallback services ────────────────────────────────────────────────────────
const LISTING_FALLBACKS = [
  { slug: 'romantic-rose-petal-surprise', title: 'Romantic Rose Petal Surprise Setup', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', price: 6999, rating: 4.9, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
  { slug: 'luxury-birthday-balloon', title: 'Luxury Birthday Balloon Decoration', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80', price: 4499, rating: 4.8, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
  { slug: 'dream-proposal-setup', title: 'Dream Proposal Setup', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80', price: 12999, rating: 4.9, location: 'At Your Location', category: 'ring-decoration', categoryLabel: 'Proposal' },
  { slug: 'candlelight-dinner-pool', title: 'Candlelight Dinner by the Pool', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', price: 12999, rating: 5.0, location: 'At Your Location', category: 'candlelight-dinner', categoryLabel: 'Dinner' },
  { slug: 'grand-wedding-decoration', title: 'Grand Wedding Decoration Package', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', price: 39999, rating: 4.7, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Wedding' },
  { slug: 'baby-shower-decoration', title: 'Baby Shower Decoration', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', price: 5999, rating: 4.8, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Baby Shower' },
  { slug: 'hotel-room-romantic-surprise', title: 'Hotel Room Romantic Surprise', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', price: 7999, rating: 4.9, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
  { slug: 'anniversary-surprise-picnic', title: 'Anniversary Surprise Picnic', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80', price: 6999, rating: 4.6, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
];

const STATIC_MAP = Object.fromEntries([
  ...ALL_STATIC_SERVICES.map((s) => [s.slug, s]),
  ...LISTING_FALLBACKS.map((s) => [s.slug, { ...s, id: s.slug }]),
]);

// ─── 10 sub-images per category ───────────────────────────────────────────────
const CATEGORY_GALLERY: Record<string, string[]> = {
  'birthday-decorations': [
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
  ],
  'anniversary-decorations': [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  ],
  'candlelight-dinner': [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  ],
  'ring-decoration': [
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  ],
};

const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
];

// ─── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gold-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm text-white/60 leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Share Modal ──────────────────────────────────────────────────────────────
function ShareModal({ title, onClose }: { title: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  const shareOptions = [
    {
      label: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: 'Twitter / X',
      icon: '𝕏',
      color: '#000000',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: 'Facebook',
      icon: 'f',
      color: '#1877F2',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: 'Telegram',
      icon: '✈',
      color: '#0088cc',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{ background: 'rgba(17,17,17,0.95)', border: '1px solid rgba(201,169,110,0.2)', backdropFilter: 'blur(20px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Share this experience</h3>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
              <XIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Share options */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {shareOptions.map((opt) => (
              <a
                key={opt.label}
                href={opt.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold transition-transform group-hover:scale-110 group-active:scale-95"
                  style={{ background: opt.color }}
                >
                  {opt.icon}
                </div>
                <span className="text-[10px] text-white/50 group-hover:text-white/80 transition-colors">{opt.label}</span>
              </a>
            ))}
          </div>

          {/* Copy link */}
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-gold-500/30 transition-all"
          >
            <Copy className="w-4 h-4 text-gold-500 flex-shrink-0" />
            <span className="text-sm text-white/70 truncate flex-1 text-left">{url}</span>
            <span className={`text-xs font-medium flex-shrink-0 transition-colors ${copied ? 'text-green-400' : 'text-gold-500'}`}>
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Related card ─────────────────────────────────────────────────────────────
function AlsoLikeCard({ service }: { service: typeof ALL_STATIC_SERVICES[0] }) {
  return (
    <Link href={`/services/${service.slug}`}>
      <div className="group cursor-pointer">
        <div className="relative h-32 sm:h-40 rounded-xl overflow-hidden mb-2">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/60">
            <Star className="w-2.5 h-2.5 text-gold-500 fill-gold-500" />
            <span className="text-[10px] text-white font-medium">{service.rating}</span>
          </div>
        </div>
        <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-2 mb-1">
          {service.title}
        </h4>
        <p className="text-sm font-bold text-gold-500">{formatCurrency(service.price)}</p>
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [service, setService] = useState<IService | null>(null);
  const [staticService, setStaticService] = useState<typeof ALL_STATIC_SERVICES[0] | null>(null);
  const [related, setRelated] = useState<typeof ALL_STATIC_SERVICES>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchService = async () => {
      setLoading(true);
      const staticFound = STATIC_MAP[slug];
      if (staticFound) {
        setStaticService(staticFound);
        setRelated(
          ALL_STATIC_SERVICES
            .filter((s) => s.category === staticFound.category && s.slug !== slug)
            .slice(0, 6)
        );
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get(`/services/${slug}`);
        if (data?.data) {
          setService(data.data);
          const cat = typeof data.data.category === 'object' ? data.data.category.slug : '';
          setRelated(ALL_STATIC_SERVICES.filter((s) => s.category === cat).slice(0, 6));
          setLoading(false);
          return;
        }
      } catch { /* fall through */ }
      router.push('/services');
      setLoading(false);
    };
    fetchService();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black pt-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-gold-500/30 border-t-gold-500 animate-spin mx-auto" />
          <p className="text-white/40 text-sm">Loading experience...</p>
        </div>
      </div>
    );
  }

  // Normalise data
  const title       = service?.title       ?? staticService?.title       ?? '';
  const description = service?.description ?? 'Premium luxury decoration service crafted with meticulous attention to every detail. Our expert team transforms your space into an extraordinary experience.';
  const price       = service?.price       ?? staticService?.price       ?? 0;
  const discounted  = service?.discountedPrice;
  const effectivePrice = discounted || price;
  const rating      = service?.rating      ?? staticService?.rating      ?? 5;
  const reviewCount = service?.reviewCount ?? 128;
  const duration    = service?.duration    ?? '3-4 hours';
  const maxGuests   = service?.maxGuests   ?? 10;
  const categoryName = service
    ? (typeof service.category === 'object' ? service.category.name : '')
    : (staticService?.categoryLabel ?? '');
  const categorySlug = service
    ? (typeof service.category === 'object' ? service.category.slug : '')
    : (staticService?.category ?? '');
  const includes    = service?.includes    ?? ['Professional setup team', 'Premium quality materials', 'On-time delivery & setup', 'Post-event cleanup', 'Photography of the setup', 'Customization consultation'];
  const excludes    = service?.excludes    ?? ['Venue charges', 'Food & beverages', 'Additional lighting equipment'];
  const highlights  = service?.highlights  ?? ['Luxury premium setup', 'Experienced decorators', 'Customizable themes', '100% satisfaction guarantee', 'Same-day booking available'];
  const discount    = discounted ? getDiscountPercentage(price, discounted) : 0;

  // Build gallery: API images + category gallery (up to 10 total)
  const apiImages = service?.images?.map((i) => i.url) ?? [];
  const catGallery = CATEGORY_GALLERY[categorySlug] ?? DEFAULT_GALLERY;
  const mainImage = staticService?.image ?? apiImages[0] ?? catGallery[0];
  const allImages = apiImages.length > 0
    ? [...new Set([...apiImages, ...catGallery])].slice(0, 10)
    : [mainImage, ...catGallery.filter((img) => img !== mainImage)].slice(0, 10);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
        return;
      } catch { /* fall through to modal */ }
    }
    setShowShare(true);
  };

  return (
    <div className="min-h-screen bg-luxury-black pt-16 sm:pt-20 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/40 mb-5 flex-wrap">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-gold-500 transition-colors">Services</Link>
          {categoryName && (
            <>
              <span>/</span>
              <Link href={`/categories/${categorySlug}`} className="hover:text-gold-500 transition-colors">{categoryName}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-white/60 truncate max-w-[160px] sm:max-w-xs">{title}</span>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-12">

          {/* ── Left: Image gallery ── */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-luxury-dark">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={allImages[activeImage]}
                  alt={`${title} - view ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Discount badge */}
              {discount > 0 && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                  -{discount}% OFF
                </span>
              )}

              {/* Nav arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((p) => (p - 1 + allImages.length) % allImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-all active:scale-90"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage((p) => (p + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-all active:scale-90"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/60 text-xs text-white/70">
                {activeImage + 1} / {allImages.length}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImage ? 'border-gold-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-75'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="space-y-4">
            {/* Category + Title */}
            {categoryName && (
              <Link href={`/categories/${categorySlug}`}>
                <span className="text-xs text-gold-500 font-medium tracking-widest uppercase hover:text-gold-400 transition-colors">
                  {categoryName}
                </span>
              </Link>
            )}
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
              {title}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-gold-500">{formatCurrency(effectivePrice)}</span>
              {discounted && (
                <span className="text-base text-white/30 line-through mb-0.5">{formatCurrency(price)}</span>
              )}
              {discount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 mb-0.5">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
                <span className="text-white font-medium">{rating.toFixed(1)}</span>
                <span>({reviewCount} reviews)</span>
              </span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{duration}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />Up to {maxGuests}</span>
            </div>

            {/* City selector — custom styled, no default checkbox */}
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Select City</p>
              <div className="relative">
                <select
                  suppressHydrationWarning
                  className="w-full appearance-none px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all cursor-pointer pr-10"
                >
                  <option value="delhi">Delhi</option>
                  <option value="noida">Noida</option>
                  <option value="gurgaon">Gurgaon</option>
                  <option value="faridabad">Faridabad</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>

            {/* Inclusions */}
            {includes.length > 0 && (
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">What&apos;s Included</p>
                <ul className="space-y-1.5">
                  {includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <Check className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Accordions */}
            <div className="pt-1">
              <Accordion title="Description" defaultOpen>
                <p>{description}</p>
              </Accordion>
              <Accordion title="Setup Details & Timing">
                <ul className="space-y-1.5">
                  <li>• Our team arrives <strong className="text-white/80">2 hours before</strong> the event for setup.</li>
                  <li>• Total setup time: <strong className="text-white/80">{duration}</strong>.</li>
                  <li>• Please ensure the venue is accessible and cleared before our arrival.</li>
                  <li>• Customization requests must be made <strong className="text-white/80">48 hours in advance</strong>.</li>
                  <li>• Complimentary photography of the setup is included.</li>
                </ul>
              </Accordion>
              <Accordion title="Decoration Materials">
                <ul className="space-y-1.5">
                  <li>• Premium quality latex and foil balloons.</li>
                  <li>• Fresh flowers and artificial floral arrangements.</li>
                  <li>• LED fairy lights and warm-tone candles.</li>
                  <li>• Satin ribbons, organza fabric, and premium draping.</li>
                  <li>• Personalized banners and custom props on request.</li>
                </ul>
              </Accordion>
              <Accordion title="Surprise Instructions">
                <ul className="space-y-1.5">
                  <li>• Keep the surprise person away from the venue during setup.</li>
                  <li>• Share a trusted contact who can coordinate with our team.</li>
                  <li>• We maintain complete discretion throughout the process.</li>
                  <li>• Provide venue access details at least 3 hours before the event.</li>
                </ul>
              </Accordion>
              <Accordion title="Important Notes">
                <ul className="space-y-1.5">
                  <li>• Prices are inclusive of all setup and cleanup charges.</li>
                  <li>• Outdoor setups are subject to weather conditions.</li>
                  <li>• Hotel room setups require prior permission from the hotel.</li>
                  <li>• We do not provide food, beverages, or venue booking services.</li>
                </ul>
              </Accordion>
              <Accordion title="Cancellation Policy">
                <ul className="space-y-1.5">
                  <li>• <strong className="text-white/80">Free cancellation</strong> up to 48 hours before the event.</li>
                  <li>• <strong className="text-white/80">50% refund</strong> for cancellations 24–48 hours before.</li>
                  <li>• <strong className="text-white/80">No refund</strong> for cancellations within 24 hours.</li>
                  <li>• Rescheduling is free up to 24 hours before the event.</li>
                </ul>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Highlights + Excludes */}
        {(highlights.length > 0 || excludes.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {highlights.length > 0 && (
              <div className="luxury-card p-5">
                <h3 className="text-sm font-semibold text-gold-500 uppercase tracking-wider mb-4">Highlights</h3>
                <ul className="space-y-2">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <Sparkles className="w-3.5 h-3.5 text-gold-500 mt-0.5 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {excludes.length > 0 && (
              <div className="luxury-card p-5">
                <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4">Not Included</h3>
                <ul className="space-y-2">
                  {excludes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <XIcon className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* You may also like */}
        {related.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-5">
              You May Also <span className="text-gold-gradient">Like</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {related.map((s) => (
                <AlsoLikeCard key={s.id} service={s} />
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-gold-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </button>
      </div>

      {/* ── Bottom Sticky Action Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 sm:py-4"
        style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.95) 100%)', borderTop: '1px solid rgba(201,169,110,0.15)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {/* Price */}
          <div className="flex-shrink-0">
            <p className="text-[10px] text-white/40 leading-none mb-0.5">Starting from</p>
            <p className="text-lg font-bold text-gold-500 leading-none">{formatCurrency(effectivePrice)}</p>
          </div>

          {/* Main CTA */}
          <Link href={`/booking?service=${slug}`} className="flex-1">
            <button className="w-full btn-luxury flex items-center justify-center gap-2 py-3 text-sm">
              <Sparkles className="w-4 h-4" />
              Plan My Celebration
            </button>
          </Link>

          {/* Call */}
          <a
            href="tel:+919999999999"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-luxury-black transition-all active:scale-90"
            style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' }}
            aria-label="Call us"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi! I'm interested in: ${title}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all active:scale-90"
            style={{ background: '#25D366' }}
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
          </a>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex-shrink-0 w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors active:scale-90"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && (
          <ShareModal title={title} onClose={() => setShowShare(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
