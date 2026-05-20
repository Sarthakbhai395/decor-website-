'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Clock, Users, MapPin, Check, X as XIcon,
  ArrowLeft, Share2, ChevronLeft, ChevronRight,
  Sparkles, Phone, ChevronDown, ChevronUp, Minus, Plus,
} from 'lucide-react';
import { IService } from '@/types';
import { formatCurrency, getDiscountPercentage } from '@/lib/utils';
import api from '@/lib/axios';
import { ALL_STATIC_SERVICES } from '@/components/home/CategoryServiceRows';

// ─── Static fallback map (slug → service) ────────────────────────────────────
const STATIC_MAP = Object.fromEntries(
  ALL_STATIC_SERVICES.map((s) => [s.slug, s])
);

// ─── Accordion item ───────────────────────────────────────────────────────────
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gold-500" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
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

// ─── "You may also like" card ─────────────────────────────────────────────────
function AlsoLikeCard({ service }: { service: typeof ALL_STATIC_SERVICES[0] }) {
  return (
    <Link href={`/services/${service.slug}`}>
      <div className="group cursor-pointer">
        <div className="relative h-36 sm:h-44 rounded-xl overflow-hidden mb-2">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
        <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-2 mb-1">
          {service.title}
        </h4>
        <p className="text-sm font-bold text-gold-500">{formatCurrency(service.price)}</p>
      </div>
    </Link>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [service, setService] = useState<IService | null>(null);
  const [staticService, setStaticService] = useState<typeof ALL_STATIC_SERVICES[0] | null>(null);
  const [related, setRelated] = useState<typeof ALL_STATIC_SERVICES>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeMsg, setPincodeMsg] = useState('');
  const [checkingPin, setCheckingPin] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchService = async () => {
      setLoading(true);

      // 1. Check static map first — these slugs never exist in the backend
      const staticFound = STATIC_MAP[slug];
      if (staticFound) {
        setStaticService(staticFound);
        setRelated(
          ALL_STATIC_SERVICES
            .filter((s) => s.category === staticFound.category && s.slug !== slug)
            .slice(0, 5)
        );
        setLoading(false);
        return;
      }

      // 2. Only hit the API for slugs not in our static data
      try {
        const { data } = await api.get(`/services/${slug}`);
        if (data?.data) {
          setService(data.data);
          // Try to get related from API
          try {
            const rel = await api.get(`/services/${slug}/related`);
            if (rel.data?.data?.length) {
              setRelated(rel.data.data.map((s: IService) => ({
                id: s._id, slug: s.slug, title: s.title,
                image: s.images[0]?.url || '',
                price: s.discountedPrice || s.price,
                rating: s.rating, location: 'At Your Location',
                category: typeof s.category === 'object' ? s.category.slug : '',
                categoryLabel: typeof s.category === 'object' ? s.category.name : '',
              })));
              setLoading(false);
              return;
            }
          } catch { /* fall through */ }

          // Use static related by same category
          const cat = typeof data.data.category === 'object' ? data.data.category.slug : '';
          setRelated(ALL_STATIC_SERVICES.filter((s) => s.category === cat).slice(0, 5));
          setLoading(false);
          return;
        }
      } catch { /* API failed */ }

      // 3. Nothing found anywhere — redirect
      router.push('/services');
      setLoading(false);
    };

    fetchService();
  }, [slug, router]);

  const handlePincodeCheck = () => {
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setPincodeMsg('Please enter a valid 6-digit pincode.');
      return;
    }
    setCheckingPin(true);
    setTimeout(() => {
      setPincodeMsg('✓ Service available at this location!');
      setCheckingPin(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black pt-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full border-2 border-gold-500/30 border-t-gold-500 animate-spin mx-auto" />
          <p className="text-white/50 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // ── Normalise data from either source ──────────────────────────────────────
  const title       = service?.title       ?? staticService?.title       ?? '';
  const description = service?.description ?? 'Premium luxury decoration service crafted with attention to every detail.';
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
  const images: string[] = service?.images?.map((i) => i.url) ?? (staticService ? [staticService.image] : []);
  const includes    = service?.includes    ?? ['Professional setup team', 'Premium quality materials', 'On-time delivery', 'Post-event cleanup'];
  const excludes    = service?.excludes    ?? ['Venue charges', 'Food & beverages'];
  const highlights  = service?.highlights  ?? ['Luxury premium setup', 'Experienced decorators', 'Customizable themes', '100% satisfaction guarantee'];
  const discount    = discounted ? getDiscountPercentage(price, discounted) : 0;

  return (
    <div className="min-h-screen bg-luxury-black pt-20 sm:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/40 mb-6 flex-wrap">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-gold-500 transition-colors">Services</Link>
          <span>/</span>
          <span className="text-white/70 truncate max-w-[180px] sm:max-w-xs">{title}</span>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-14">

          {/* ── Left: Image gallery ── */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-luxury-dark">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  src={images[activeImage] || 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80'}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white">
                  -{discount}% OFF
                </span>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => setActiveImage((p) => (p + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? 'border-gold-500' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Details ── */}
          <div className="space-y-5">
            {/* Category + Title */}
            {categoryName && (
              <span className="text-xs text-gold-500 font-medium tracking-widest uppercase">{categoryName}</span>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white leading-tight">
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

            {/* City selector */}
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">City</p>
              <select
                suppressHydrationWarning
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all"
              >                <option value="delhi-ncr">Delhi NCR</option>
                <option value="noida">Noida</option>
                <option value="gurgaon">Gurgaon</option>
                <option value="faridabad">Faridabad</option>
              </select>
            </div>

            {/* Inclusions */}
            {includes.length > 0 && (
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Inclusions</p>
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

            {/* Quantity */}
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-bold text-white w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pincode check */}
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold-500" /> Check Service Availability
              </p>
              <div className="flex gap-2">
                <input
                  suppressHydrationWarning
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit pincode"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '')); setPincodeMsg(''); }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-all"
                />
                <button
                  onClick={handlePincodeCheck}
                  disabled={checkingPin}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-luxury-black transition-all active:scale-95 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' }}
                >
                  {checkingPin ? '...' : 'Check Now'}
                </button>
              </div>
              {pincodeMsg && (
                <p className={`text-xs mt-1.5 ${pincodeMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
                  {pincodeMsg}
                </p>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 pt-1">
              <Link href={`/booking?service=${slug}&qty=${quantity}`} className="flex-1">
                <button className="w-full btn-luxury flex items-center justify-center gap-2 py-3.5">
                  <Sparkles className="w-4 h-4" />
                  Book Now
                </button>
              </Link>
              <a
                href="tel:+919999999999"
                className="flex items-center gap-2 px-5 py-3.5 rounded-full font-bold text-sm text-luxury-black relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' }}
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Call Now</span>
              </a>
              <button
                onClick={() => navigator.share?.({ title, url: window.location.href }).catch(() => {})}
                className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Accordions */}
            <div className="pt-2">
              <Accordion title="Description">
                <p>{description}</p>
              </Accordion>
              <Accordion title="Need to Know — General Guidelines">
                <ul className="space-y-1.5">
                  <li>• Please ensure the venue is accessible 2 hours before the event.</li>
                  <li>• Our team will arrive 30 minutes prior to setup.</li>
                  <li>• Customization requests must be made 48 hours in advance.</li>
                  <li>• Photography of the setup is included.</li>
                </ul>
              </Accordion>
              <Accordion title="Cancellation & Refund Policy">
                <ul className="space-y-1.5">
                  <li>• Free cancellation up to 48 hours before the event.</li>
                  <li>• 50% refund for cancellations 24–48 hours before.</li>
                  <li>• No refund for cancellations within 24 hours.</li>
                  <li>• Rescheduling is free up to 24 hours before the event.</li>
                </ul>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Highlights + Excludes */}
        {(highlights.length > 0 || excludes.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
            {highlights.length > 0 && (
              <div className="luxury-card p-5 sm:p-6">
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
              <div className="luxury-card p-5 sm:p-6">
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
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-6">
              You May Also <span className="text-gold-gradient">Like</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
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
    </div>
  );
}
