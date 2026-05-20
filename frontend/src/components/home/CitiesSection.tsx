'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin } from 'lucide-react';

const cities = [
  { name: 'Mumbai',    slug: 'mumbai',    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&q=70&auto=format', services: 120 },
  { name: 'Delhi',     slug: 'delhi',     image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&q=70&auto=format', services: 95 },
  { name: 'Bangalore', slug: 'bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300&q=70&auto=format', services: 88 },
  { name: 'Hyderabad', slug: 'hyderabad', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=70&auto=format', services: 76 },
  { name: 'Chennai',   slug: 'chennai',   image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&q=70&auto=format', services: 65 },
  { name: 'Pune',      slug: 'pune',      image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=300&q=70&auto=format', services: 58 },
  { name: 'Goa',       slug: 'goa',       image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&q=70&auto=format', services: 45 },
  { name: 'Jaipur',    slug: 'jaipur',    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=300&q=70&auto=format', services: 42 },
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
          <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">Pan India</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            We Serve Across{' '}
            <span className="text-gold-gradient">India</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {cities.map((city) => (
            <Link key={city.slug} href={`/cities/${city.slug}`}>
              <div
                className="relative overflow-hidden rounded-2xl group cursor-pointer active:scale-95 transition-transform duration-150"
                style={{ aspectRatio: '4/3' }}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
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
          ))}
        </motion.div>
      </div>
    </section>
  );
}
