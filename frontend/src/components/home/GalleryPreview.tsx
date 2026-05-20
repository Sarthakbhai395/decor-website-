'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { X, ArrowRight, ZoomIn } from 'lucide-react';

const galleryImages = [
  { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80', category: 'Anniversary', span: 'col-span-2 row-span-2' },
  { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80', category: 'Birthday' },
  { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80', category: 'Proposal' },
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', category: 'Dinner' },
  { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80', category: 'Wedding' },
  { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80', category: 'Romantic' },
  { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', category: 'Cabana' },
];

export default function GalleryPreview() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-luxury-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">
            Our Work
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            Moments We&apos;ve{' '}
            <span className="text-gold-gradient">Created</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[160px] sm:auto-rows-[200px]">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                img.span ? 'hidden md:block md:col-span-2 md:row-span-2' : ''
              }`}
              onClick={() => setSelectedImage(img.url)}
            >
              <img
                src={img.url}
                alt={img.category}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col items-center gap-2">
                  <ZoomIn className="w-8 h-8 text-white" />
                  <span className="text-xs text-white font-medium">{img.category}</span>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2 py-1 rounded-full text-xs bg-gold-gradient text-luxury-black font-medium">
                  {img.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/gallery">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-luxury-outline flex items-center gap-2 mx-auto"
            >
              View Full Gallery
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
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
            <motion.button
              className="absolute top-4 right-4 w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white"
              whileHover={{ scale: 1.1 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage}
              alt="Gallery"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
