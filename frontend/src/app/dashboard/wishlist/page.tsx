'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Star, Trash2 } from 'lucide-react';
import { IService } from '@/types';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/users/wishlist');
        setWishlist(data.data || []);
      } catch {
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const removeFromWishlist = async (serviceId: string) => {
    try {
      await api.post(`/users/wishlist/${serviceId}`);
      setWishlist((prev) => prev.filter((s) => s._id !== serviceId));
      toast.success('Removed from wishlist');
    } catch {}
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white">My Wishlist</h1>
        <p className="text-white/50 text-sm mt-1">{wishlist.length} saved experiences</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 skeleton rounded-2xl" />)}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 mb-4">Your wishlist is empty</p>
          <Link href="/services">
            <button className="btn-luxury text-sm px-6 py-2">Explore Services</button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlist.map((service, i) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="luxury-card p-4 flex gap-4 group"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img src={service.images[0]?.url || ''} alt={service.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-gold-500/70 mb-0.5">
                      {typeof service.category === 'object' ? service.category.name : ''}
                    </p>
                    <h3 className="text-sm font-semibold text-white truncate">{service.title}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-gold-500 fill-gold-500" />
                      <span className="text-xs text-white/60">{service.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromWishlist(service._id)}
                    className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-base font-bold text-gold-500">
                    {formatCurrency(service.discountedPrice || service.price)}
                  </span>
                  <Link href={`/services/${service.slug}`}>
                    <button className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400">
                      Book Now <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
