'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin } from 'lucide-react';

const cities = [
  { name: 'Delhi',      slug: 'delhi',      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80&auto=format', services: 120 },
  { name: 'Noida',      slug: 'noida',      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80&auto=format', services: 95 },
  { name: 'Ghaziabad',  slug: 'ghaziabad',  image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80&auto=format', services: 75 },
  { name: 'Faridabad',  slug: 'faridabad',  image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80&auto=format', services: 60 },
];

export default function CitiesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-luxury-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">Delhi NCR</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            We Serve Across{' '}
            <span className="text-gold-gradient">Delhi NCR</span>
          </h2>
          <p className="text-white/50 text-sm max-w-md mx-auto mt-2">
            Premium decoration services available in all 4 cities of Delhi NCR
          </p>
          <div className="section-divider mt-4" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {cities.map((city, i) => (
            <motion.div
              key={city.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/categories/birthday-decorations`}>
                <div
                  className="relative overflow-hidden rounded-2xl group cursor-pointer active:scale-95 transition-transform duration-150"
                  style={{ aspectRatio: '4/3' }}
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <div className="flex items-center gap-1 mb-0.5">
                      <MapPin className="w-3 h-3 text-gold-500" />
                      <span className="text-xs text-gold-500">{city.services}+ services</span>
                    </div>
                    <h3 className="text-sm sm:text-lg font-display font-bold text-white group-hover:text-gold-400 transition-colors">
                      {city.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
