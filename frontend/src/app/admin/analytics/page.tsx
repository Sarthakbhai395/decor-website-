'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  CalendarDays,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DashboardAnalytics } from '@/types';
import { formatCurrency, formatDate, getBookingStatusColor } from '@/lib/utils';
import api from '@/lib/axios';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  in_progress: '#a855f7',
  completed: '#22c55e',
  cancelled: '#ef4444',
  refunded: '#6b7280',
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/admin/analytics');
        setAnalytics(data.data);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 skeleton rounded-2xl" />
          ))}
        </div>
        <div className="h-80 skeleton rounded-2xl" />
      </div>
    );
  }

  const overview = analytics?.overview;
  const revenueData = analytics?.revenueByMonth.map((r) => ({
    month: MONTHS[r._id.month - 1],
    revenue: r.revenue,
    bookings: r.count,
  })) || [];

  const statusData = analytics?.bookingsByStatus.map((s) => ({
    name: s._id,
    value: s.count,
    color: STATUS_COLORS[s._id] || '#6b7280',
  })) || [];

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(overview?.totalRevenue || 0),
      sub: `${formatCurrency(overview?.monthRevenue || 0)} this month`,
      icon: IndianRupee,
      color: 'text-gold-500',
      bg: 'bg-gold-500/10',
      trend: '+12%',
      up: true,
    },
    {
      label: 'Total Bookings',
      value: (overview?.totalBookings || 0).toLocaleString(),
      sub: `${overview?.monthBookings || 0} this month`,
      icon: CalendarDays,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      trend: overview?.bookingGrowth || '0%',
      up: true,
    },
    {
      label: 'Total Customers',
      value: (overview?.totalUsers || 0).toLocaleString(),
      sub: `${overview?.newUsers || 0} new this month`,
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      trend: '+8%',
      up: true,
    },
    {
      label: 'Pending Bookings',
      value: (overview?.pendingBookings || 0).toLocaleString(),
      sub: 'Requires attention',
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      trend: '-3%',
      up: false,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Analytics Dashboard</h1>
        <p className="text-white/50 text-sm mt-1">Overview of your business performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="luxury-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${card.up ? 'text-green-400' : 'text-red-400'}`}>
                {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.trend}
              </span>
            </div>
            <div className={`text-2xl font-bold ${card.color} mb-1`}>{card.value}</div>
            <div className="text-xs text-white/50">{card.label}</div>
            <div className="text-xs text-white/30 mt-1">{card.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 luxury-card p-6">
          <h3 className="text-sm font-semibold text-white mb-6">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '12px', color: '#fff' }}
                formatter={(v: number) => [formatCurrency(v), 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#c9a96e" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Pie */}
        <div className="luxury-card p-6">
          <h3 className="text-sm font-semibold text-white mb-6">Booking Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '12px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-white/60 capitalize">{s.name.replace('_', ' ')}</span>
                </div>
                <span className="text-white font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings & Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="luxury-card p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {analytics?.recentBookings.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-xs font-medium text-white">#{booking.bookingId}</p>
                  <p className="text-xs text-white/40">{formatDate(booking.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gold-500">{formatCurrency(booking.finalAmount)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getBookingStatusColor(booking.bookingStatus)}`}>
                    {booking.bookingStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="luxury-card p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Top Services</h3>
          <div className="space-y-3">
            {analytics?.topServices.map((service, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center text-xs text-gold-500 font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{service.title}</p>
                  <p className="text-xs text-white/40">{service.bookings} bookings</p>
                </div>
                <span className="text-xs font-bold text-gold-500">{formatCurrency(service.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
