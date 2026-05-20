'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Eye, ArrowLeft, Calendar, User } from 'lucide-react';
import { IBlog } from '@/types';
import api from '@/lib/axios';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/blogs/${slug}`);
        setBlog(data.data);
      } catch {
        router.push('/blog');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black pt-24 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-gold-500/30 border-t-gold-500 animate-spin" />
      </div>
    );
  }

  if (!blog) return null;

  const authorName = typeof blog.author === 'object' ? blog.author.name : 'Luxe Celebrations';
  const publishDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="min-h-screen bg-luxury-black pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-gold-500 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white/70 truncate max-w-[200px]">{blog.title}</span>
        </div>

        {/* Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gold-gradient text-luxury-black">
            {blog.category}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight"
        >
          {blog.title}
        </motion.h1>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-5 text-sm text-white/40 mb-8 pb-8 border-b border-white/10"
        >
          <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{authorName}</span>
          {publishDate && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{publishDate}</span>}
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{blog.readTime} min read</span>
          <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{blog.views.toLocaleString()} views</span>
        </motion.div>

        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative aspect-video rounded-2xl overflow-hidden mb-10"
        >
          <img
            src={blog.coverImage.url}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Excerpt */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-white/70 leading-relaxed mb-8 font-light italic border-l-2 border-gold-500 pl-5"
        >
          {blog.excerpt}
        </motion.p>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="prose prose-invert prose-gold max-w-none text-white/70 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/10">
            {blog.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/50">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Back */}
        <div className="mt-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-gold-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>
        </div>
      </div>
    </div>
  );
}
