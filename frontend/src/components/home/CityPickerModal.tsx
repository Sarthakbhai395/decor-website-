'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ChevronDown } from 'lucide-react';
import { useCityStore } from '@/store/cityStore';

const CITIES = [
  {
    name: 'Delhi',
    slug: 'delhi',
    monumentName: 'India Gate',
  },
  {
    name: 'Noida',
    slug: 'noida',
    monumentName: 'Sector 18, Noida',
  },
  {
    name: 'Ghaziabad',
    slug: 'ghaziabad',
    monumentName: 'Ghaziabad',
  },
  {
    name: 'Faridabad',
    slug: 'faridabad',
    monumentName: 'Faridabad',
  },
];

// Unique landmark images per city
const CITY_IMAGES: Record<string, string> = {
  'delhi':      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=280&q=80&auto=format',
  'noida':      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=280&q=80&auto=format',
  'ghaziabad':  'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=280&q=80&auto=format',
  'faridabad':  'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=280&q=80&auto=format',
};

export default function CityPickerModal() {
  const { selectedCity, setSelectedCity } = useCityStore();
  const [open, setOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Show modal 5 seconds after mount if no city selected yet
  useEffect(() => {
    if (selectedCity || hasShown) return;
    const timer = setTimeout(() => {
      setOpen(true);
      setHasShown(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [selectedCity, hasShown]);

  const handleSelect = (city: typeof CITIES[0]) => {
    setSelectedCity(city);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger button in navbar — always visible */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/5 hover:bg-gold-500/10 transition-all"
        aria-label="Change city"
      >
        <MapPin className="w-3.5 h-3.5 text-gold-500" />
        <span className="text-xs font-medium text-white/80 max-w-[80px] truncate">
          {selectedCity ? selectedCity.name : 'Select City'}
        </span>
        <ChevronDown className="w-3 h-3 text-white/40" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)' }}
            onClick={() => selectedCity && setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: '#111111', border: '1px solid rgba(201,169,110,0.2)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-display font-bold text-white">
                      Pick a City
                    </h2>
                    <p className="text-xs text-white/40 mt-0.5">
                      Select your city to view experiences near you
                    </p>
                  </div>
                  {selectedCity && (
                    <button
                      onClick={() => setOpen(false)}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* City Grid */}
              <div className="p-6 grid grid-cols-2 gap-4">
                {CITIES.map((city) => {
                  const isSelected = selectedCity?.slug === city.slug;
                  return (
                    <motion.button
                      key={city.slug}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleSelect(city)}
                      className={`relative rounded-2xl overflow-hidden group transition-all duration-200 ${
                        isSelected
                          ? 'ring-2 ring-gold-500 ring-offset-2 ring-offset-[#111]'
                          : 'hover:ring-1 hover:ring-gold-500/50'
                      }`}
                    >
                      {/* Monument image */}
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={CITY_IMAGES[city.slug]}
                          alt={city.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Selected badge */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* City name */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gold-500 flex-shrink-0" />
                          <span className={`text-sm font-semibold ${isSelected ? 'text-gold-400' : 'text-white'}`}>
                            {city.name}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <p className="text-center text-xs text-white/30">
                  More cities coming soon ✨
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
