'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  label: string;
  slug: string;
  image: string;
  emoji: string;
  index: number;
  isDark?: boolean;
}

export default function CategoryCard({ label, slug, image, emoji, index, isDark = false }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="w-full flex-shrink-0"
      style={{ minWidth: '105px', maxWidth: '200px' }}
    >
      <Link href={`/categories/${slug}`} className="block group">
        {/* Card Wrapper - Dark or Light theme */}
        <div 
          className="relative flex flex-col w-full rounded-[24px] overflow-visible transition-all duration-300"
          style={{
            background: isDark 
              ? 'linear-gradient(180deg, #111111 0%, #080808 100%)' 
              : '#ffffff',
            boxShadow: isDark
              ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 16px -6px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(251, 191, 36, 0.15)'
              : '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 16px -6px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.04)',
            border: isDark ? '1px solid rgba(201, 169, 110, 0.2)' : '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Top Image Part - 3D Pop-out */}
          <div className="relative w-full rounded-t-[24px] aspect-[4/3.8] overflow-visible">
            <div className="w-full h-full rounded-t-[22px] overflow-hidden transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03] group-hover:shadow-[0_12px_24px_-5px_rgba(0,0,0,0.6)]">
              <img
                src={image}
                alt={label}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </div>
          </div>

          {/* Bottom Container: Icon Badge + Text (Icon is just above text now) */}
          <div className="w-full flex flex-col items-center pt-4 pb-4 px-2 text-center rounded-b-[24px]">
            {/* Increased Size Icon Badge positioned directly above text */}
            <div 
              className="w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center text-xl bg-white border-2 border-neutral-100 mb-2.5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
              style={{
                boxShadow: isDark 
                  ? '0 4px 12px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
                  : '0 4px 10px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
                border: isDark ? '2px solid #c9a96e' : '2px solid #f3f4f6',
              }}
            >
              <span className="drop-shadow-sm text-base sm:text-lg">{emoji}</span>
            </div>

            {/* Label */}
            <h3 
              className={`font-semibold transition-colors duration-300 text-xs sm:text-sm tracking-wide line-clamp-1`}
              style={{
                color: isDark ? '#ffffff' : '#2d1b18',
              }}
            >
              {index + 1}. {label}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
