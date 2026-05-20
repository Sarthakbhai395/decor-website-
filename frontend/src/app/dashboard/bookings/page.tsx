'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, MapPin, Package, ChevronRight, Search } from 'lucide-react';
import { IBooking } from '@/types';
import { formatCurrency, formatDate, getBookingStatusColor } from '@/lib/utils';
import api from '@/lib/axios';
import Link from 'next/link';

const STATUS_TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const params = activeTab !== 'all' ? `?status=${activeTab}` : '';
        const { data } = await api.get(`/bookings/my-bookings${params}`);
        setBookings(data.data || []);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [activeTab]);

  const filtered = bookings.filter((b) =>
    b.bookingId.toLowerCase().includes(search.toLowerCase()) ||
    (typeof b.service === 'object' && b.service.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">My Bookings</h1>
          <p className="text-white/50 text-sm mt-1">Track and manage your luxury experiences</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search by booking ID or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-all"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-gold-gradient text-luxury-black'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="luxury-card p-6 h-32 skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <CalendarDays className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">No bookings found</p>
          <Link href="/services">
            <button className="btn-luxury mt-4 text-sm px-6 py-2">
              Explore Services
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/dashboard/bookings/${booking._id}`}>
                <div className="luxury-card p-5 cursor-pointer group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Service Image */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        {typeof booking.service === 'object' && booking.service.images?.[0] ? (
                          <img
                            src={booking.service.images[0].url}
                            alt={booking.service.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gold-500/10 flex items-center justify-center">
                            <Package className="w-6 h-6 text-gold-500/50" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-white/40">#{booking.bookingId}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBookingStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-gold-500 transition-colors truncate">
                          {typeof booking.service === 'object' ? booking.service.title : 'Service'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {formatDate(booking.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {booking.timeSlot}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {typeof booking.city === 'object' ? booking.city.name : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-lg font-bold text-gold-500">
                        {formatCurrency(booking.finalAmount)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-gold-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
