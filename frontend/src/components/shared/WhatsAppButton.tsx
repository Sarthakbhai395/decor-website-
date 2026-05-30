'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

/* ─── Constants ──────────────────────────────────────────────────────────── */
const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || '916306059912';
const WA_MSG = encodeURIComponent("Hi! I'm interested in booking a luxury decoration service. Can you help me?");

/* ─── WhatsApp Only Button (no popup, no call icon) ──────────────────────── */
export default function FloatingContactButtons() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const isProductPage = pathname?.startsWith('/services/');
  const isBookingPage = pathname?.startsWith('/booking-contact');

  // Show floating button after 2 seconds
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (isBookingPage) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className={`fixed ${isProductPage ? 'bottom-32 md:bottom-12' : 'bottom-24 md:bottom-10'} right-4 md:right-6 z-[85]`}
        >
          {/* WhatsApp Button Only */}
          <motion.a
            whileTap={{ scale: 0.9 }}
            href={`https://wa.me/${PHONE}?text=${WA_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: '#25D366',
              boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
            }}
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-6 h-6 text-white fill-white relative z-10" />
            {/* Notification dot */}
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-gold-500 rounded-full border-2 border-luxury-black" />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
