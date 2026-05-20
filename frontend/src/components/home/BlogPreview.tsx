'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Clock, Eye } from 'lucide-react';

const blogs = [
  {
    title: '10 Romantic Decoration Ideas for Your Anniversary',
    slug: '10-romantic-decoration-ideas-anniversary',
    excerpt: 'Transform your anniversary into an unforgettable experience with these stunning decoration ideas that will leave your partner speechless.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
    category: 'Anniversary',
    readTime: 5,
    views: 2340,
    date: 'Nov 15, 2024',
  },
  {
    title: 'The Ultimate Guide to Planning a Surprise Proposal',
    slug: 'ultimate-guide-surprise-proposal',
    excerpt: 'Everything you need to know about planning the perfect proposal — from choosing the location to the decoration setup.',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80',
    category: 'Proposal',
    readTime: 8,
    views: 4521,
    date: 'Nov 10, 2024',
  },
  {
    title: 'Luxury Balloon Decoration Trends for 2025',
    slug: 'luxury-balloon-decoration-trends-2025',
    excerpt: 'Discover the hottest balloon decoration trends that are taking celebrations to the next level of luxury and elegance.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
    category: 'Trends',
    readTime: 4,
    views: 1876,
    date: 'Nov 5, 2024',
  },
];

export default function BlogPreview() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-luxury-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-4"
        >
          <div>
            <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">
              Inspiration
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3">
              From Our{' '}
              <span className="text-gold-gradient">Blog</span>
            </h2>
          </div>
          <Link href="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="btn-luxury-outline flex items-center gap-2 text-sm"
            >
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
            <motion.div
              key={blog.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/blog/${blog.slug}`}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="luxury-card group cursor-pointer h-full"
                >
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs bg-gold-gradient text-luxury-black font-medium">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {blog.readTime} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {blog.views.toLocaleString()}
                      </span>
                      <span>{blog.date}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-white group-hover:text-gold-500 transition-colors line-clamp-2 mb-3">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center gap-2 mt-4 text-gold-500 text-xs font-medium">
                      Read More
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
