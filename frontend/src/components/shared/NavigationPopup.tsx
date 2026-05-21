'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, X, Sparkles } from 'lucide-react';

const PHONE = '+916306059912';
const WA = '916306059912';

export default function NavigationPopup() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [prevPath, setPrevPath] = useState('');

  useEffect(() => {
    // Show popup when user navigates to a new page (not on first load)
    if (prevPath && prevPath !== pathname && !dismissed) {
      const timer = setTimeout(() => {
        setShow(true);
        // Auto-dismiss after 6 seconds
        const autoClose = setTimeout(() => setShow(false), 6000);
        return () => clearTimeout(autoClose);
      }, 800);
      return () => clearTimeout(timer);
    }
    setPrevPath(pathname);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    setPrevPath(pathname);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    // Re-enable after 3 page navigations
    setTimeout(() => setDismissed(false), 1);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-6 sm:w-72 z-[80]"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative rounded-2xl overflow-hidden p-4"
            style={{
              background: 'rgba(17,17,17,0.75)',
              border: '1px solid rgba(201,169,110,0.25)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.1)',
            }}
          >
            {/* Dismiss */}
            <button
              onClick={handleDismiss}
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
                href={`tel:${PHONE}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-luxury-black transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' }}
                onClick={handleDismiss}
              >
                <Phone className="w-3.5 h-3.5" />
                Call Now
              </a>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I need help planning a decoration.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
                style={{ background: '#25D366' }}
                onClick={handleDismiss}
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
