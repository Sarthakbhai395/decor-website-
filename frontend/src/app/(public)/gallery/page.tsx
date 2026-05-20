'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const CATEGORIES = ['All', 'Anniversary', 'Birthday', 'Proposal', 'Wedding', 'Dinner', 'Cabana'];

const images = [
  { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80', category: 'Anniversary', title: 'Rose Petal Anniversary' },
  { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80', category: 'Birthday', title: 'Luxury Birthday Setup' },
  { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80', category: 'Proposal', title: 'Dream Proposal' },
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', category: 'Dinner', title: 'Candlelight Dinner' },
  { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80', category: 'Wedding', title: 'Wedding Decor' },
  { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', category: 'Anniversary', title: 'Romantic Setup' },
  { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', category: 'Cabana', title: 'Cabana Setup' },
  { url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80', category: 'Birthday', title: 'Baby Welcome' },
  { url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80', category: 'Birthday', title: 'Birthday Celebration' },
  { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', category: 'Wedding', title: 'Wedding Ceremony' },
  { url: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80', category: 'Dinner', title: 'Romantic Dinner' },
  { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', category: 'Proposal', title: 'Surprise Proposal' },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filtered = activeCategory === 'All' ? images : images.filter((i) => i.category === activeCategory);

  return (
    <div className="min-h-screen bg-luxury-black pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">Our Portfolio</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            Moments We&apos;ve <span className="text-gold-gradient">Created</span>
          </h1>
          <div className="section-divider" />
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gold-gradient text-luxury-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((img, i) => (
            <motion.div
              key={img.url}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="relative overflow-hidden rounded-2xl group cursor-pointer break-inside-avoid"
              onClick={() => setSelectedImage(img.url)}
            >
              <img src={img.url} alt={img.title} className="w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-white font-medium">{img.title}</p>
                <p className="text-xs text-gold-500">{img.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white">
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={selectedImage}
              alt="Gallery"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
