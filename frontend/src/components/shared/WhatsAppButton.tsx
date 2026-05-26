'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X, Sparkles } from 'lucide-react';

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || '916306059912';
const WA_MSG = encodeURIComponent("Hi! I'm interested in booking a luxury decoration service. Can you help me?");

export default function FloatingContactButtons() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  // Navigation popup state
  const [showPopup, setShowPopup] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [prevPath, setPrevPath] = useState('');

  const isProductPage = pathname?.startsWith('/services/');

  // Show floating button after 2 seconds
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Trigger popup when user navigates to a new page
  useEffect(() => {
    if (prevPath && prevPath !== pathname && !dismissed) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        // Auto-dismiss after 6 seconds
        const autoClose = setTimeout(() => setShowPopup(false), 6000);
        return () => clearTimeout(autoClose);
      }, 800);
      return () => clearTimeout(timer);
    }
    setPrevPath(pathname ?? '');
  }, [pathname, dismissed, prevPath]);

  useEffect(() => {
    setPrevPath(pathname ?? '');
  }, []);

  const handleDismissPopup = () => {
    setShowPopup(false);
    setDismissed(true);
    // Reset dismissal after some time to allow it on future navigation
    setTimeout(() => setDismissed(false), 15000);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          /* Lift the button up to bottom-10/12 or 28/32 on product pages */
          className={`fixed ${isProductPage ? 'bottom-28 sm:bottom-32' : 'bottom-10 sm:bottom-12'} right-4 sm:right-6 z-50 flex flex-col items-end gap-3`}
        >
          {/* Emerge/Collapse Animation for the Navigation Popup */}
          <AnimatePresence>
            {showPopup && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 60, x: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0, y: 60, x: 20, filter: 'blur(10px)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
                style={{ transformOrigin: 'calc(100% - 28px) calc(100% + 40px)' }}
                className="w-[280px] sm:w-72 mb-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="relative rounded-2xl overflow-hidden p-4"
                  style={{
                    background: 'rgba(17,17,17,0.85)',
                    border: '1.2px solid rgba(201,169,110,0.3)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,110,0.15)',
                  }}
                >
                  {/* Dismiss */}
                  <button
                    onClick={handleDismissPopup}
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Content */}
                  <div className="flex items-start gap-3 pr-6">
                    <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-gold-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-0.5">Need Help Planning?</p>
                      <p className="text-xs text-white/50 leading-relaxed">Our experts are ready to create your perfect celebration.</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3.5">
                    <a
                      href={`tel:+${PHONE}`}
                      className="flex-1 flex items-center justify-center gap-1.2 py-2 rounded-xl text-xs font-bold text-luxury-black transition-all active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' }}
                      onClick={handleDismissPopup}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Now
                    </a>
                    <a
                      href={`https://wa.me/${PHONE}?text=${encodeURIComponent("Hi! I need help planning a decoration.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.2 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
                      style={{ background: '#25D366' }}
                      onClick={handleDismissPopup}
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded contact options */}
          <AnimatePresence>
            {expanded && (
              <>
                {/* WhatsApp */}
                <motion.a
                  href={`https://wa.me/${PHONE}?text=${WA_MSG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.8 }}
                  transition={{ delay: 0.05 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-white text-sm font-medium"
                  style={{ background: '#25D366' }}
                  aria-label="Chat on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp</span>
                </motion.a>

                {/* Call */}
                <motion.a
                  href={`tel:+${PHONE}`}
                  initial={{ opacity: 0, y: 16, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.8 }}
                  transition={{ delay: 0 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-luxury-black text-sm font-bold relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)',
                    backgroundSize: '200% auto',
                  }}
                  aria-label="Call us"
                >
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
                      backgroundSize: '200% 100%',
                      animation: 'callShine 2.5s linear infinite',
                    }}
                  />
                  <Phone className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Call Now</span>
                </motion.a>
              </>
            )}
          </AnimatePresence>

          {/* Main toggle button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setExpanded(!expanded)}
            className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: expanded
                ? '#374151'
                : 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)',
              boxShadow: '0 4px 20px rgba(201, 169, 110, 0.3)',
            }}
            aria-label={expanded ? 'Close contact options' : 'Contact us'}
          >
            {!expanded && (
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                  animation: 'callShine 2s linear infinite',
                }}
              />
            )}
            <AnimatePresence mode="wait">
              {expanded ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                <motion.div key="phone" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Phone className="w-6 h-6 text-luxury-black" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notification dot */}
            {!expanded && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-luxury-black" />
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
