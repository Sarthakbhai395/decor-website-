'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LayoutGrid, Phone, MessageCircle, Sparkles, X } from 'lucide-react';

const PHONE_NUMBER = '+916306059912';
const WA_NUMBER = '916306059912';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide on product/service detail pages (they have their own sticky bar)
  const isProductPage = pathname?.match(/^\/services\/[^/]+$/);
  
  // Close popup on route change
  useEffect(() => {
    setShowContactPopup(false);
  }, [pathname]);

  // Close popup when clicking outside
  const handleBackdropClick = useCallback(() => {
    setShowContactPopup(false);
  }, []);

  if (!mounted || isProductPage) return null;

  const isHome = pathname === '/';
  const isExplore = pathname === '/categories' || pathname?.startsWith('/categories/');

  return (
    <>
      {/* Contact Popup Overlay */}
      <AnimatePresence>
        {showContactPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] bg-black/60 md:hidden"
              onClick={handleBackdropClick}
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="fixed bottom-[80px] right-3 z-[95] w-[200px] rounded-2xl overflow-hidden md:hidden"
              style={{
                background: 'rgba(14, 14, 14, 0.96)',
                border: '1px solid rgba(201, 169, 110, 0.3)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(201, 169, 110, 0.08)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <span className="text-[11px] font-semibold text-white/80 tracking-wide">Get in Touch</span>
                <button
                  onClick={() => setShowContactPopup(false)}
                  className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Options */}
              <div className="px-3 pb-3 space-y-1.5">
                {/* Chat Option */}
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! I'm interested in booking a decoration service.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all active:scale-95 group"
                  style={{ background: 'rgba(37, 211, 102, 0.12)' }}
                  onClick={() => setShowContactPopup(false)}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#25D366' }}
                  >
                    <MessageCircle className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Chat</p>
                    <p className="text-[10px] text-white/40">WhatsApp</p>
                  </div>
                </a>

                {/* Call Option */}
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all active:scale-95 group"
                  style={{ background: 'rgba(201, 169, 110, 0.1)' }}
                  onClick={() => setShowContactPopup(false)}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 100%)' }}
                  >
                    <Phone className="w-4 h-4 text-luxury-black" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Call</p>
                    <p className="text-[10px] text-white/40">Dial Now</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Bottom Navigation Bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-[80] md:hidden"
        style={{
          background: 'linear-gradient(to top, rgba(8, 8, 8, 0.99) 0%, rgba(10, 10, 10, 0.97) 100%)',
          borderTop: '1px solid rgba(201, 169, 110, 0.15)',
        }}
      >
        <div className="flex items-end justify-around px-1 pt-1.5 pb-2 max-w-lg mx-auto relative">
          {/* Home */}
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[56px] group"
          >
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-200 ${
                isHome ? 'bg-gold-500/15' : ''
              }`}
            >
              <Home
                className={`w-[18px] h-[18px] transition-colors duration-200 ${
                  isHome ? 'text-gold-500' : 'text-white/45 group-active:text-white/70'
                }`}
              />
            </div>
            <span
              className={`text-[9px] font-semibold tracking-wide transition-colors duration-200 ${
                isHome ? 'text-gold-500' : 'text-white/40'
              }`}
            >
              Home
            </span>
          </Link>

          {/* Explore */}
          <Link
            href="/categories"
            className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[56px] group"
          >
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-200 ${
                isExplore ? 'bg-gold-500/15' : ''
              }`}
            >
              <LayoutGrid
                className={`w-[18px] h-[18px] transition-colors duration-200 ${
                  isExplore ? 'text-gold-500' : 'text-white/45 group-active:text-white/70'
                }`}
              />
            </div>
            <span
              className={`text-[9px] font-semibold tracking-wide transition-colors duration-200 ${
                isExplore ? 'text-gold-500' : 'text-white/40'
              }`}
            >
              Explore
            </span>
          </Link>

          {/* Center CTA — Deco starts from ₹1999 */}
          <Link
            href="/services?maxPrice=1999"
            className="flex flex-col items-center -mt-4 group"
          >
            <div
              className="relative px-4 py-2.5 rounded-full overflow-hidden active:scale-95 transition-transform duration-150"
              style={{
                background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)',
                backgroundSize: '200% auto',
                boxShadow: '0 4px 20px rgba(201, 169, 110, 0.4), 0 0 0 3px rgba(8, 8, 8, 0.99)',
              }}
            >
              {/* Shimmer sweep */}
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                  animation: 'callShine 2.5s linear infinite',
                }}
              />
              <div className="flex items-center gap-1 relative z-10">
                <Sparkles className="w-3.5 h-3.5 text-luxury-black" />
                <div className="flex flex-col items-center leading-none">
                  <span className="text-[8px] font-bold text-luxury-black/70 tracking-wider uppercase">
                    Deco starts from
                  </span>
                  <span className="text-[13px] font-black text-luxury-black tracking-tight">
                    ₹1999
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Contact — Combined Call + WhatsApp */}
          <button
            onClick={() => setShowContactPopup(!showContactPopup)}
            className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[56px] group"
          >
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-200 ${
                showContactPopup ? 'bg-gold-500/15' : ''
              }`}
            >
              <div className="flex items-center -space-x-1">
                <Phone
                  className={`w-[14px] h-[14px] transition-colors duration-200 ${
                    showContactPopup ? 'text-gold-500' : 'text-white/45 group-active:text-white/70'
                  }`}
                />
                <MessageCircle
                  className={`w-[14px] h-[14px] transition-colors duration-200 ${
                    showContactPopup ? 'text-green-400' : 'text-white/45 group-active:text-white/70'
                  }`}
                />
              </div>
            </div>
            <span
              className={`text-[9px] font-semibold tracking-wide transition-colors duration-200 ${
                showContactPopup ? 'text-gold-500' : 'text-white/40'
              }`}
            >
              Contact
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
