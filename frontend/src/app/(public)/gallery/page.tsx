'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const CATEGORIES = ['All', 'Anniversary', 'Birthday', 'Proposal', 'Wedding', 'Dinner', 'Kids', 'Surprise', 'Corporate', 'Car'];

const images = [
  { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', category: 'Anniversary', title: 'Rose Petal Anniversary' },
  { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80', category: 'Birthday', title: 'Luxury Birthday Setup' },
  { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80', category: 'Proposal', title: 'Dream Proposal' },
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', category: 'Dinner', title: 'Candlelight Dinner' },
  { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80', category: 'Wedding', title: 'Wedding Decor' },
  { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80', category: 'Anniversary', title: 'Romantic Setup' },
  { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', category: 'Dinner', title: 'Rooftop Dinner' },
  { url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80', category: 'Kids', title: 'Baby Welcome' },
  { url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80', category: 'Birthday', title: 'Birthday Celebration' },
  { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', category: 'Wedding', title: 'Wedding Ceremony' },
  { url: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=80', category: 'Dinner', title: 'Romantic Dinner' },
  { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80', category: 'Proposal', title: 'Surprise Proposal' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', category: 'Kids', title: 'Kids Party Decor' },
  { url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80', category: 'Birthday', title: 'Balloon Birthday' },
  { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80', category: 'Proposal', title: 'Floral Proposal' },
  { url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80', category: 'Car', title: 'Car Decoration' },
  { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80', category: 'Car', title: 'Anniversary Car Decor' },
  { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', category: 'Surprise', title: 'Hotel Room Surprise' },
  { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', category: 'Anniversary', title: 'Golden Anniversary' },
  { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', category: 'Dinner', title: 'Indoor Dining' },
  { url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80', category: 'Dinner', title: 'Fairy Lights Dinner' },
  { url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80', category: 'Car', title: 'Birthday Car Surprise' },
  { url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80', category: 'Car', title: 'Luxury Car Floral' },
  { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', category: 'Corporate', title: 'Corporate Event' },
  { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', category: 'Corporate', title: 'Product Launch' },
  { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80', category: 'Wedding', title: 'Floral Mandap' },
  { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', category: 'Wedding', title: 'Royal Wedding' },
  { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80', category: 'Surprise', title: 'Surprise Picnic' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', category: 'Kids', title: 'Rainbow Kids Party' },
  { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80', category: 'Kids', title: 'Mickey Mouse Decor' },
  { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', category: 'Anniversary', title: 'Silver Anniversary' },
  { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80', category: 'Proposal', title: 'Rooftop Proposal' },
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', category: 'Dinner', title: 'Poolside Dinner' },
  { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80', category: 'Wedding', title: 'Garden Wedding' },
  { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', category: 'Surprise', title: 'Balloon Surprise' },
  { url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80', category: 'Birthday', title: 'Pastel Birthday' },
  { url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80', category: 'Birthday', title: 'Elegant Birthday' },
  { url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80', category: 'Kids', title: 'Candy Land Decor' },
  { url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80', category: 'Car', title: 'Wedding Car Decor' },
  { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80', category: 'Car', title: 'Proposal Car Setup' },
  { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', category: 'Anniversary', title: 'Candlelit Anniversary' },
  { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80', category: 'Wedding', title: 'Intimate Wedding' },
  { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80', category: 'Surprise', title: 'Midnight Surprise' },
  { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', category: 'Corporate', title: 'Office Party' },
  { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', category: 'Corporate', title: 'Award Ceremony' },
  { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80', category: 'Birthday', title: 'Neon Birthday' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', category: 'Kids', title: 'Unicorn Party' },
  { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', category: 'Wedding', title: 'Sangeet Night' },
  { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80', category: 'Proposal', title: 'Candlelit Proposal' },
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', category: 'Dinner', title: 'Terrace Dinner' },
];

// Duplicate to reach ~100 images
const allImages = [
  ...images,
  ...images.map((img, i) => ({ ...img, url: img.url.replace('w=600', 'w=601'), title: img.title + ' II' })),
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filtered = activeCategory === 'All' ? allImages : allImages.filter((i) => i.category === activeCategory);

  // Auto-scroll every 1.5 seconds
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    autoScrollRef.current = setInterval(() => {
      if (!container) return;
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (container.scrollTop >= maxScroll - 10) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ top: 120, behavior: 'smooth' });
      }
    }, 1500);

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [activeCategory]);

  const pauseScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  };

  return (
    <div className="min-h-screen bg-luxury-black pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">Our Portfolio</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            Moments We&apos;ve <span className="text-gold-gradient">Created</span>
          </h1>
          <p className="text-white/50 text-sm max-w-xl mx-auto mb-4">
            Over 500+ celebrations crafted across Delhi, Noida, Ghaziabad & Faridabad
          </p>
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

        {/* Scrollable Gallery Container */}
        <div
          ref={scrollRef}
          className="h-[70vh] overflow-y-auto no-scrollbar rounded-2xl"
          onMouseEnter={pauseScroll}
          onMouseLeave={() => {
            const container = scrollRef.current;
            if (!container) return;
            autoScrollRef.current = setInterval(() => {
              const maxScroll = container.scrollHeight - container.clientHeight;
              if (container.scrollTop >= maxScroll - 10) {
                container.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                container.scrollBy({ top: 120, behavior: 'smooth' });
              }
            }, 1500);
          }}
        >
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3 p-1">
            {filtered.map((img, i) => (
              <motion.div
                key={`${img.url}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                className="relative overflow-hidden rounded-xl group cursor-pointer break-inside-avoid mb-3"
                onClick={() => setSelectedImage(img.url)}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
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

        <p className="text-center text-xs text-white/30 mt-4">
          Auto-scrolling • Hover to pause • Click to zoom
        </p>
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
