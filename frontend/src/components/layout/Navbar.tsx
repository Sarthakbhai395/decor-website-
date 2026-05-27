'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Menu, X, Sun, Moon, Heart, Bell, User,
  ChevronDown, Sparkles, LogOut, LayoutDashboard,
  Settings, Phone, MessageCircle,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import CityPickerModal from '@/components/home/CityPickerModal';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/categories', label: 'Categories', hasDropdown: true },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const SIDEBAR_CATEGORIES = [
  { label: 'Car Decor', slug: 'car-decoration', emoji: '🚗' },
  { label: 'Candlelight Dinner', slug: 'candlelight-dinner', emoji: '🕯️' },
  { label: 'Proposal Decoration', slug: 'ring-decoration', emoji: '💍' },
  { label: 'Birthday Decoration', slug: 'birthday-decorations', emoji: '🎂' },
  { label: 'Anniversary Decoration', slug: 'anniversary-decorations', emoji: '💑' },
  { label: 'Kids Decoration', slug: 'kids-decoration', emoji: '🎈' },
  { label: 'Wedding Decoration', slug: 'wedding-decoration', emoji: '💒' },
  { label: 'Surprise Decoration', slug: 'surprise-decoration', emoji: '🎁' },
  { label: 'Corporate Decoration', slug: 'corporate-decoration', emoji: '🏢' },
];

const PHONE_NUMBER = '+916306059912';
const WA_NUMBER = '916306059912';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [catDropOpen, setCatDropOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const catDropRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setCatDropOpen(false); }, [pathname]);

  // Close category dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catDropRef.current && !catDropRef.current.contains(e.target as Node)) {
        setCatDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    setUserMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-black/92 border-b border-gold-500/20 shadow-luxury'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-luxury-black" />
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-display font-bold text-gold-gradient" style={{ textShadow: '0 0 20px rgba(201,169,110,0.6)', letterSpacing: '0.02em' }}>Melting Eve</span>
              </div>
              <span className="sm:hidden text-sm font-display font-bold text-gold-gradient" style={{ textShadow: '0 0 16px rgba(201,169,110,0.6)' }}>ME</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-7">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div key={link.href} ref={catDropRef} className="relative">
                    <button
                      onMouseEnter={() => setCatDropOpen(true)}
                      onClick={() => setCatDropOpen(!catDropOpen)}
                      className={cn(
                        'relative flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-200 group',
                        pathname.startsWith('/categories') ? 'text-gold-500' : 'text-white/70 hover:text-white'
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', catDropOpen && 'rotate-180')} />
                      <span className={cn(
                        'absolute -bottom-1 left-0 h-px bg-gold-gradient transition-all duration-300',
                        pathname.startsWith('/categories') ? 'w-full' : 'w-0 group-hover:w-full'
                      )} />
                    </button>

                    <AnimatePresence>
                      {catDropOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.97 }}
                          transition={{ duration: 0.18 }}
                          onMouseLeave={() => setCatDropOpen(false)}
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 rounded-2xl overflow-hidden z-50"
                          style={{
                            background: 'rgba(13,13,13,0.97)',
                            border: '1px solid rgba(201,169,110,0.2)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                          }}
                        >
                          <div className="p-2">
                            <p className="text-[10px] text-gold-500/50 uppercase tracking-widest font-medium px-3 py-2">Our Categories</p>
                            {SIDEBAR_CATEGORIES.map((cat, i) => (
                              <motion.div
                                key={cat.slug}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                              >
                                <Link
                                  href={`/categories/${cat.slug}`}
                                  onClick={() => setCatDropOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-gold-500/10 transition-all"
                                >
                                  <span className="text-base w-6 text-center flex-shrink-0">{cat.emoji}</span>
                                  <span>{cat.label}</span>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative text-sm font-medium tracking-wide transition-colors duration-200 group',
                      pathname === link.href ? 'text-gold-500' : 'text-white/70 hover:text-white'
                    )}
                  >
                    {link.label}
                    <span className={cn(
                      'absolute -bottom-1 left-0 h-px bg-gold-gradient transition-all duration-300',
                      pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                    )} />
                  </Link>
                )
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CityPickerModal />

              {/* Call Button */}
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)', backgroundSize: '200% auto' }}
                aria-label="Call us"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
                <Phone className="w-3.5 h-3.5 text-luxury-black" />
                <span className="hidden sm:inline text-xs font-bold text-luxury-black tracking-wide">Call / Chat</span>
              </a>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-gold-500 transition-colors"
                aria-label="Toggle theme"
              >
                {mounted ? (
                  theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
                ) : <Sun className="w-4 h-4" />}
              </button>

              {/* Authenticated user actions */}
              {isAuthenticated && (
                <>
                  <Link href="/dashboard/wishlist" className="hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center text-white/70 hover:text-rose-400 transition-colors">
                    <Heart className="w-4 h-4" />
                  </Link>
                  <Link href="/dashboard/notifications" className="hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center text-white/70 hover:text-gold-500 transition-colors relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-gold-500 rounded-full" />
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-white/10 border border-gold-500/20 hover:border-gold-500/40 transition-all"
                    >
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gold-gradient flex items-center justify-center">
                          <span className="text-[10px] font-bold text-luxury-black">{user?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <span className="text-xs text-white/80 hidden sm:block max-w-[70px] truncate">{user?.name}</span>
                      <ChevronDown className={cn('w-3 h-3 text-white/50 transition-transform hidden sm:block', userMenuOpen && 'rotate-180')} />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-[#1a1a1a] border border-gold-500/20 overflow-hidden shadow-luxury z-50"
                        >
                          <div className="p-3 border-b border-white/10">
                            <p className="text-sm font-medium text-white">{user?.name}</p>
                            <p className="text-xs text-white/50 truncate">{user?.email}</p>
                          </div>
                          <div className="p-2">
                            {user?.role === 'admin' && (
                              <Link href="/admin/analytics" onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-gold-500 hover:bg-gold-500/10 transition-all">
                                <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                              </Link>
                            )}
                            <Link href="/dashboard/bookings" onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-gold-500 hover:bg-gold-500/10 transition-all">
                              <User className="w-4 h-4" /> My Dashboard
                            </Link>
                            <Link href="/dashboard/profile" onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-gold-500 hover:bg-gold-500/10 transition-all">
                              <Settings className="w-4 h-4" /> Settings
                            </Link>
                            <button onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
                              <LogOut className="w-4 h-4" /> Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Full-height Sidebar Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/70"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-[280px] sm:w-[320px] z-[70] flex flex-col overflow-hidden"
              style={{ background: '#0d0d0d', borderRight: '1px solid rgba(201,169,110,0.15)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gold-500/10">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-luxury-black" />
                  </div>
                  <span className="text-sm font-display font-bold text-gold-gradient" style={{ textShadow: '0 0 16px rgba(201,169,110,0.6)' }}>Melting Eve</span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {/* Nav links — Mobile: Categories, About, Contact only */}
                <div className="px-4 pt-4 pb-2">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium px-2 mb-2">Navigation</p>
                  {navLinks
                    .filter((link) =>
                      ['/categories', '/about', '/contact'].includes(link.href)
                    )
                    .sort((a, b) => {
                      const order = ['/categories', '/about', '/contact'];
                      return order.indexOf(a.href) - order.indexOf(b.href);
                    })
                    .map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5',
                          pathname === link.href || (link.href === '/categories' && pathname.startsWith('/categories'))
                            ? 'text-gold-500 bg-gold-500/10 border border-gold-500/20'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Categories */}
                <div className="px-4 pt-2 pb-4">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium px-2 mb-2">Categories</p>
                  {SIDEBAR_CATEGORIES.map((cat, i) => (
                    <motion.div
                      key={cat.slug}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navLinks.length + i) * 0.04 }}
                    >
                      <Link
                        href={`/categories/${cat.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all mb-0.5"
                      >
                        <span className="text-base w-6 text-center flex-shrink-0">{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Auth links */}
                {isAuthenticated && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium px-2 mb-2">Account</p>
                    <Link href="/dashboard/wishlist" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all mb-0.5">
                      <Heart className="w-4 h-4 text-rose-400" /> Wishlist
                    </Link>
                    <Link href="/dashboard/bookings" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all mb-0.5">
                      <User className="w-4 h-4 text-gold-500" /> My Dashboard
                    </Link>
                  </div>
                )}
              </div>

              {/* ── Sticky Bottom: Call + WhatsApp ── */}
              <div className="px-4 py-4 border-t border-gold-500/10 space-y-2.5"
                style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.98), rgba(13,13,13,0.95))' }}
              >
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="relative flex items-center justify-center gap-2.5 w-full py-3 rounded-2xl overflow-hidden group font-bold text-sm text-luxury-black"
                  style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)', backgroundSize: '200% auto' }}
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
                  <Phone className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Call Us Now</span>
                </a>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! I'd like to book a luxury decoration service.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-98"
                  style={{ background: '#25D366' }}
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
