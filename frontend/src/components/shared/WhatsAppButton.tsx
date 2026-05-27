'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X, Sparkles } from 'lucide-react';

/* ─── Constants ──────────────────────────────────────────────────────────── */
const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || '916306059912';
const WA_MSG = encodeURIComponent("Hi! I'm interested in booking a luxury decoration service. Can you help me?");
const POPUP_VISIBLE_DURATION = 5000; // 5 seconds
const INITIAL_DELAY = 3000; // 3 seconds before first popup
const NAV_POPUP_DELAY = 800; // delay after navigation
const DISMISS_COOLDOWN = 15000; // cooldown after dismiss

/* ─── Genie Animation Variants ───────────────────────────────────────────── */
const geniePopupVariants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    scaleY: 0.1,
    y: 60,
    x: 20,
    filter: 'blur(12px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    scaleY: 1,
    y: 0,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 22,
      mass: 0.9,
      staggerChildren: 0.06,
      filter: { type: 'tween', duration: 0.3, ease: 'easeOut' }, // Prevents negative blur overshoot
    },
  },
  exit: {
    opacity: 0,
    scale: 0.2,
    scaleY: 0.05,
    y: 70,
    x: 25,
    filter: 'blur(14px)',
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 28,
      mass: 0.7,
      filter: { type: 'tween', duration: 0.3, ease: 'easeIn' },
    },
  },
};

const contentChildVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/* ─── Particle Component ─────────────────────────────────────────────────── */
function GenieParticles({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${3 + i * 1.5}px`,
            height: `${3 + i * 1.5}px`,
            right: `${10 + i * 18}%`,
            bottom: '-20px',
            background: `radial-gradient(circle, rgba(240, 208, 128, ${0.6 - i * 0.08}) 0%, rgba(201, 169, 110, 0) 70%)`,
          }}
          animate={{
            y: [0, -(40 + i * 20), -(60 + i * 30)],
            x: [0, (i % 2 === 0 ? 8 : -8), (i % 2 === 0 ? 15 : -15)],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.3],
          }}
          transition={{
            duration: 2 + i * 0.4,
            repeat: Infinity,
            ease: 'easeOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function FloatingContactButtons() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Genie popup state
  const [showPopup, setShowPopup] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [prevPath, setPrevPath] = useState('');
  const [glowing, setGlowing] = useState(false);

  const isProductPage = pathname?.startsWith('/services/');

  // Show floating button after 2 seconds
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Auto-show popup on initial load after delay
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      if (!dismissed) {
        setGlowing(true);
        setTimeout(() => {
          setShowPopup(true);
        }, 600);
      }
    }, INITIAL_DELAY);
    return () => clearTimeout(timer);
  }, [visible, dismissed]);

  // Auto-hide popup after POPUP_VISIBLE_DURATION
  useEffect(() => {
    if (!showPopup) return;
    const timer = setTimeout(() => {
      setShowPopup(false);
      setTimeout(() => setGlowing(false), 500);
    }, POPUP_VISIBLE_DURATION);
    return () => clearTimeout(timer);
  }, [showPopup]);

  // Trigger popup on navigation
  useEffect(() => {
    if (prevPath && prevPath !== pathname && !dismissed) {
      const timer = setTimeout(() => {
        setGlowing(true);
        setTimeout(() => setShowPopup(true), 400);
      }, NAV_POPUP_DELAY);
      return () => clearTimeout(timer);
    }
    setPrevPath(pathname ?? '');
  }, [pathname, dismissed, prevPath]);

  // Track initial path
  useEffect(() => {
    setPrevPath(pathname ?? '');
  }, []);

  const handleDismissPopup = useCallback(() => {
    setShowPopup(false);
    setDismissed(true);
    setTimeout(() => setGlowing(false), 500);
    // Reset dismissal after cooldown
    setTimeout(() => setDismissed(false), DISMISS_COOLDOWN);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className={`fixed ${isProductPage ? 'bottom-28 sm:bottom-32' : 'bottom-10 sm:bottom-12'} right-4 sm:right-6 z-50 flex flex-col items-end gap-3`}
        >
          {/* ─── Genie Popup ─── */}
          <AnimatePresence>
            {showPopup && (
              <motion.div
                variants={geniePopupVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ transformOrigin: 'calc(100% - 28px) calc(100% + 44px)' }}
                className="w-[260px] sm:w-[280px] mb-1 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Genie particles */}
                <GenieParticles isVisible={showPopup} />

                {/* Ambient golden glow behind popup */}
                <div
                  className="absolute -inset-3 rounded-3xl pointer-events-none z-0"
                  style={{
                    background:
                      'radial-gradient(ellipse at bottom right, rgba(201, 169, 110, 0.12) 0%, transparent 70%)',
                    filter: 'blur(8px)',
                  }}
                />

                <motion.div
                  className="relative rounded-2xl overflow-hidden p-4 z-10"
                  style={{
                    background: 'rgba(14, 14, 14, 0.88)',
                    border: '1.2px solid rgba(201, 169, 110, 0.35)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    boxShadow:
                      '0 20px 50px rgba(0, 0, 0, 0.65), 0 0 30px rgba(201, 169, 110, 0.08), 0 0 0 0.5px rgba(201, 169, 110, 0.2)',
                  }}
                  /* Subtle floating motion while visible */
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {/* Dismiss */}
                  <motion.button
                    variants={contentChildVariants}
                    onClick={handleDismissPopup}
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </motion.button>

                  {/* Content */}
                  <motion.div variants={contentChildVariants} className="flex items-start gap-3 pr-6">
                    <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-gold-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-0.5">
                        Need Help Planning?
                      </p>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Our experts are ready to create your perfect celebration.
                      </p>
                    </div>
                  </motion.div>

                  {/* Actions */}
                  <motion.div variants={contentChildVariants} className="flex gap-2 mt-3.5">
                    <a
                      href={`tel:+${PHONE}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-luxury-black transition-all active:scale-95"
                      style={{
                        background:
                          'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)',
                      }}
                      onClick={handleDismissPopup}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Now
                    </a>
                    <a
                      href={`https://wa.me/${PHONE}?text=${encodeURIComponent("Hi! I need help planning a decoration.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
                      style={{ background: '#25D366' }}
                      onClick={handleDismissPopup}
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      WhatsApp
                    </a>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Expanded contact options ─── */}
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
                    background:
                      'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)',
                    backgroundSize: '200% auto',
                  }}
                  aria-label="Call us"
                >
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
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

          {/* ─── Main toggle button (the "lamp") ─── */}
          <div className="relative">
            {/* Genie glow ring — pulses when popup is active */}
            <AnimatePresence>
              {glowing && (
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{
                    scale: [1, 1.6, 1.8],
                    opacity: [0.4, 0.15, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  style={{
                    background:
                      'radial-gradient(circle, rgba(201, 169, 110, 0.35) 0%, transparent 70%)',
                  }}
                />
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setExpanded(!expanded);
                if (showPopup) handleDismissPopup();
              }}
              className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: expanded
                  ? '#374151'
                  : 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)',
                boxShadow: glowing
                  ? '0 4px 20px rgba(201, 169, 110, 0.5), 0 0 40px rgba(201, 169, 110, 0.2)'
                  : '0 4px 20px rgba(201, 169, 110, 0.3)',
              }}
              aria-label={expanded ? 'Close contact options' : 'Contact us'}
            >
              {!expanded && (
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)',
                    backgroundSize: '200% 100%',
                    animation: 'callShine 2s linear infinite',
                  }}
                />
              )}
              <AnimatePresence mode="wait">
                {expanded ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="phone"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Phone className="w-6 h-6 text-luxury-black" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Notification dot */}
              {!expanded && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-luxury-black" />
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
