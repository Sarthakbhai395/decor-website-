'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LayoutGrid, X } from 'lucide-react';

const PHONE_NUMBER = '+916306059912';
const WA_NUMBER = '916306059912';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show popup shortly after mount
    const timer = setTimeout(() => setShowPopup(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Hide on product/service detail pages and booking pages
  const isProductPage = pathname?.match(/^\/services\/[^/]+$/) || pathname?.startsWith('/booking-contact');

  if (!mounted || isProductPage) return null;

  const isHome = pathname === '/';
  const isExplore = pathname === '/categories' || pathname?.startsWith('/categories/');

  // Golden color constant
  const GOLD = '#c9a96e';
  const GOLD_ACTIVE = '#f0d080';

  return (
    <>
      {/* ── Bottom Navigation Bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-[80] md:hidden"
        style={{
          background: 'linear-gradient(to top, rgba(8, 8, 8, 0.99) 0%, rgba(10, 10, 10, 0.97) 100%)',
          borderTop: '1px solid rgba(201, 169, 110, 0.15)',
        }}
      >
        {/* Animated Calling Popup */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="absolute right-3 bottom-[75px] w-48 bg-luxury-dark border-2 border-gold-500 rounded-2xl p-4 flex flex-col items-center text-center z-[100]"
              style={{
                transformOrigin: 'calc(100% - 20px) 100%',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(201,169,110,0.3)',
              }}
            >
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPopup(false); }}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-luxury-black border border-gold-500 flex items-center justify-center text-white hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(201,169,110,0.5)] relative overflow-hidden">
                <span className="absolute inset-0 bg-white/20 animate-ping rounded-full" style={{ animationDuration: '2s' }} />
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="#000" />
                </svg>
              </div>
              
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1">Need Help?</h3>
              <p className="text-[10px] text-white/70 mb-4">Talk to our decoration experts instantly!</p>
              
              <a
                href={`tel:${PHONE_NUMBER}`}
                onClick={() => setShowPopup(false)}
                className="w-full bg-gold-gradient text-luxury-black font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                Call Now
              </a>
              
              {/* Pointing triangle to the call icon */}
              <div className="absolute -bottom-[10px] right-[24px] w-4 h-4 bg-luxury-dark border-r-2 border-b-2 border-gold-500 transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

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
                className="w-[18px] h-[18px] transition-colors duration-200"
                style={{ color: isHome ? GOLD_ACTIVE : GOLD }}
              />
            </div>
            <span
              className="text-[9px] font-semibold tracking-wide transition-colors duration-200"
              style={{ color: isHome ? GOLD_ACTIVE : GOLD }}
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
                className="w-[18px] h-[18px] transition-colors duration-200"
                style={{ color: isExplore ? GOLD_ACTIVE : GOLD }}
              />
            </div>
            <span
              className="text-[9px] font-semibold tracking-wide transition-colors duration-200"
              style={{ color: isExplore ? GOLD_ACTIVE : GOLD }}
            >
              Explore
            </span>
          </Link>

          {/* Center CTA — Decoration under ₹2499 */}
          <Link
            href="/budget-deals"
            className="flex flex-col items-center -mt-6 group"
          >
            <div
              className="relative rounded-[30px] overflow-hidden active:scale-95 transition-transform duration-150"
              style={{
                padding: '2px',
                boxShadow: '0 4px 20px rgba(201, 169, 110, 0.4), 0 0 0 3px rgba(8, 8, 8, 0.99)',
                background: '#0a0a0a',
              }}
            >
              {/* Rotating Flare for border */}
              <div
                className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 70%, #fff 85%, transparent 100%)',
                  animation: 'spinFlare 2.5s linear infinite',
                }}
              />
              {/* Inner Golden Pill */}
              <div 
                className="relative z-10 px-5 py-2 rounded-[28px] flex flex-col items-center leading-none"
                style={{
                  background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)',
                }}
              >
                 {/* Shimmer sweep */}
                <span
                  className="absolute inset-0 pointer-events-none rounded-[28px]"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)',
                    backgroundSize: '200% 100%',
                    animation: 'callShine 2.5s linear infinite',
                  }}
                />
                <span className="text-[9px] font-bold text-luxury-black/70 tracking-widest uppercase mb-1 relative z-10">
                  Decoration under
                </span>
                <span className="text-xl font-black text-luxury-black tracking-tight leading-none relative z-10">
                  ₹2499
                </span>
              </div>
            </div>
          </Link>

          {/* Contact — Real Phone Icon (Android-style) */}
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="flex flex-col items-center gap-0.5 py-1 px-3 min-w-[56px] group"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-200">
              {/* Real Android phone SVG icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                  fill={GOLD}
                />
              </svg>
            </div>
            <span
              className="text-[9px] font-semibold tracking-wide transition-colors duration-200"
              style={{ color: GOLD }}
            >
              Call
            </span>
          </a>
        </div>
      </nav>
    </>
  );
}
