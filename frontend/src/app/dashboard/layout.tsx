'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Heart,
  Bell,
  User,
  MapPin,
  CreditCard,
  Sparkles,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/dashboard/bookings', icon: CalendarDays, label: 'My Bookings' },
  { href: '/dashboard/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
  { href: '/dashboard/addresses', icon: MapPin, label: 'Addresses' },
  { href: '/dashboard/payments', icon: CreditCard, label: 'Payment History' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/');
  };

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      {/* User Info */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
        <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-luxury-black">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white truncate">{user?.name}</p>
          <p className="text-xs text-white/50 truncate">{user?.email}</p>
          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs bg-gold-500/10 text-gold-500">
            <Sparkles className="w-2.5 h-2.5" />
            Premium Member
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={onLinkClick}>
            <motion.div
              whileHover={{ x: 4 }}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer',
                pathname === item.href
                  ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-50" />
            </motion.div>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-luxury-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* Mobile Nav Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-dark border border-gold-500/20 text-white text-sm"
          >
            <Menu className="w-4 h-4 text-gold-500" />
            <span>My Account</span>
            <span className="ml-auto text-xs text-gold-500">
              {navItems.find((n) => n.href === pathname)?.label || 'Menu'}
            </span>
          </button>
        </div>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                onClick={() => setMobileNavOpen(false)}
              />
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 h-full w-80 bg-luxury-dark border-r border-gold-500/10 z-50 lg:hidden p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-semibold text-gold-500 uppercase tracking-wider">My Account</span>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="w-8 h-8 rounded-full glass-dark flex items-center justify-center text-white/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <SidebarContent onLinkClick={() => setMobileNavOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="luxury-card p-6 sticky top-28">
              <SidebarContent />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
