'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Menu, X, Sun, Moon, Heart, Bell, User,
  ChevronDown, Sparkles, LogOut, LayoutDashboard,
  Settings, Phone,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import CityPickerModal from '@/components/home/CityPickerModal';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/categories', label: 'Categories' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const PHONE_NUMBER = '+919999999999';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    setUserMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-black/90 border-b border-gold-500/20 shadow-luxury'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-luxury-black" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-display font-bold text-gold-gradient">Luxe</span>
              <span className="text-lg font-display font-light text-white ml-1">Celebrations</span>
            </div>
            <span className="sm:hidden text-base font-display font-bold text-gold-gradient">Luxe</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
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
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            {/* City Picker */}
            <CityPickerModal />

            {/* Call Button — shining gold */}
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)',
                backgroundSize: '200% auto',
              }}
              aria-label="Call us"
            >
              {/* Shine sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
              <Phone className="w-3.5 h-3.5 text-luxury-black" />
              <span className="hidden sm:inline text-xs font-bold text-luxury-black tracking-wide">Call Now</span>
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

                {/* User dropdown */}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-black/95 border-t border-gold-500/20 overflow-hidden"
          >
            <div className="px-4 py-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    pathname === link.href
                      ? 'text-gold-500 bg-gold-500/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile call */}
              <a href={`tel:${PHONE_NUMBER}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-luxury-black btn-luxury mt-2">
                <Phone className="w-4 h-4" /> Call Us Now
              </a>

              {isAuthenticated && (
                <div className="pt-3 border-t border-white/10 space-y-1">
                  <Link href="/dashboard/wishlist" onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                    <Heart className="w-4 h-4 text-rose-400" /> Wishlist
                  </Link>
                  <Link href="/dashboard/bookings" onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                    <User className="w-4 h-4 text-gold-500" /> My Dashboard
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
