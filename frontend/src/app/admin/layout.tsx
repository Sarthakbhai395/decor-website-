'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Package,
  Star,
  Tag,
  FileText,
  Bell,
  MapPin,
  Sparkles,
  LogOut,
  ChevronRight,
  Image,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const adminNav = [
  { href: '/admin/analytics', icon: LayoutDashboard, label: 'Analytics' },
  { href: '/admin/bookings', icon: CalendarDays, label: 'Bookings' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/services', icon: Package, label: 'Services' },
  { href: '/admin/categories', icon: Image, label: 'Categories' },
  { href: '/admin/cities', icon: MapPin, label: 'Cities' },
  { href: '/admin/reviews', icon: Star, label: 'Reviews' },
  { href: '/admin/coupons', icon: Tag, label: 'Coupons' },
  { href: '/admin/blogs', icon: FileText, label: 'Blogs' },
  { href: '/admin/notifications', icon: Bell, label: 'Notifications' },
];

function SidebarContent({
  pathname,
  user,
  onLinkClick,
  onLogout,
}: {
  pathname: string;
  user: { name?: string; email?: string } | null;
  onLinkClick?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gold-500/10">
        <Link href="/" className="flex items-center gap-2" onClick={onLinkClick}>
          <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-luxury-black" />
          </div>
          <div>
            <span className="text-sm font-display font-bold text-gold-gradient">Luxe</span>
            <span className="text-xs text-white/50 ml-1">Admin</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {adminNav.map((item) => (
          <Link key={item.href} href={item.href} onClick={onLinkClick}>
            <motion.div
              whileHover={{ x: 3 }}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer',
                pathname === item.href
                  ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </div>
              {pathname === item.href && <ChevronRight className="w-3 h-3" />}
            </motion.div>
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gold-500/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-luxury-black">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gold-500">Administrator</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!isAuthenticated || user?.role !== 'admin') return null;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-luxury-black flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-luxury-dark border-r border-gold-500/10 flex-col fixed h-full z-40">
        <SidebarContent
          pathname={pathname}
          user={user}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-72 bg-luxury-dark border-r border-gold-500/10 z-50 lg:hidden flex flex-col"
            >
              <SidebarContent
                pathname={pathname}
                user={user}
                onLinkClick={() => setMobileOpen(false)}
                onLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-4 bg-luxury-dark border-b border-gold-500/10 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl glass-dark flex items-center justify-center text-white"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-luxury-black" />
            </div>
            <span className="text-sm font-display font-bold text-gold-gradient">Luxe Admin</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 sm:p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
