'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X } from 'lucide-react';

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || '919999999999';
const WA_MSG = encodeURIComponent("Hi! I'm interested in booking a luxury decoration service. Can you help me?");

export default function FloatingContactButtons() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Show after 2 seconds
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3"
        >
          {/* Expanded action buttons */}
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
                  {/* Shine animation */}
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
