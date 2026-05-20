'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Eye, ArrowRight, Search } from 'lucide-react';
import { IBlog } from '@/types';
import api from '@/lib/axios';

const BLOG_CATEGORIES = ['All', 'Decoration Tips', 'Event Planning', 'Romantic Ideas', 'Wedding', 'Birthday', 'Anniversary', 'Trends'];

const FALLBACK_BLOGS = [
  {
    _id: '1', title: '10 Romantic Decoration Ideas for Your Anniversary', slug: '10-romantic-decoration-ideas',
    excerpt: 'Transform your anniversary into an unforgettable experience with these stunning decoration ideas.',
    coverImage: { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', publicId: '1' },
    category: 'Anniversary', tags: ['romantic', 'anniversary'], readTime: 5, views: 2340,
    isPublished: true, publishedAt: '2024-11-15', createdAt: '2024-11-15',
    author: { _id: '1', name: 'Aryan Kapoor', email: '', phone: '', role: 'admin' as const, addresses: [], wishlist: [], bookings: [], isVerified: true, isActive: true, createdAt: '' },
    content: '',
  },
  {
    _id: '2', title: 'The Ultimate Guide to Planning a Surprise Proposal', slug: 'ultimate-guide-surprise-proposal',
    excerpt: 'Everything you need to know about planning the perfect proposal.',
    coverImage: { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80', publicId: '2' },
    category: 'Romantic Ideas', tags: ['proposal', 'romantic'], readTime: 8, views: 4521,
    isPublished: true, publishedAt: '2024-11-10', createdAt: '2024-11-10',
    author: { _id: '1', name: 'Priya Sharma', email: '', phone: '', role: 'admin' as const, addresses: [], wishlist: [], bookings: [], isVerified: true, isActive: true, createdAt: '' },
    content: '',
  },
  {
    _id: '3', title: 'Luxury Balloon Decoration Trends for 2025', slug: 'luxury-balloon-trends-2025',
    excerpt: 'Discover the hottest balloon decoration trends taking celebrations to the next level.',
    coverImage: { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80', publicId: '3' },
    category: 'Trends', tags: ['balloons', 'trends'], readTime: 4, views: 1876,
    isPublished: true, publishedAt: '2024-11-05', createdAt: '2024-11-05',
    author: { _id: '1', name: 'Rahul Mehta', email: '', phone: '', role: 'admin' as const, addresses: [], wishlist: [], bookings: [], isVerified: true, isActive: true, createdAt: '' },
    content: '',
  },
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/blogs');
        setBlogs(data.data || FALLBACK_BLOGS);
      } catch {
        setBlogs(FALLBACK_BLOGS as unknown as IBlog[]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = blogs.filter((b) => {
    const matchCat = activeCategory === 'All' || b.category === activeCategory;
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-luxury-black pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">Inspiration</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            Our <span className="text-gold-gradient">Blog</span>
          </h1>
          <div className="section-divider" />
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat ? 'bg-gold-gradient text-luxury-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-80 skeleton rounded-2xl" />)
            : filtered.map((blog, i) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link href={`/blog/${blog.slug}`}>
                    <motion.div whileHover={{ y: -6 }} className="luxury-card group cursor-pointer h-full">
                      <div className="relative h-48 overflow-hidden rounded-t-2xl">
                        <img src={blog.coverImage.url} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs bg-gold-gradient text-luxury-black font-medium">{blog.category}</span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views.toLocaleString()}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-gold-500 transition-colors line-clamp-2 mb-3">{blog.title}</h3>
                        <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                        <div className="flex items-center gap-2 mt-4 text-gold-500 text-xs font-medium">
                          Read More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </div>
  );
}
