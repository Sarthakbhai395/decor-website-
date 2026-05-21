'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Star, Users, Award } from 'lucide-react';

const stats = [
  { icon: Heart, value: 5000, suffix: '+', label: 'Happy Couples', color: 'text-rose-400' },
  { icon: Star, value: 4.9, suffix: '/5', label: 'Average Rating', color: 'text-gold-500', decimal: true },
  { icon: Users, value: 4, suffix: '', label: 'Cities Covered', color: 'text-purple-400' },
  { icon: Award, value: 8, suffix: '+', label: 'Years of Excellence', color: 'text-blue-400' },
];

function AnimatedCounter({
  value,
  suffix,
  decimal,
}: {
  value: number;
  suffix: string;
  decimal?: boolean;
}) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(decimal ? Math.round(current * 10) / 10 : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value, decimal]);

  return (
    <span ref={ref}>
      {decimal ? count.toFixed(1) : count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="relative py-20 bg-luxury-black overflow-hidden">
      {/* Decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl glass-dark border border-gold-500/20 mb-4 group-hover:border-gold-500/50 transition-all">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-2 ${stat.color}`}>
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimal={stat.decimal}
                />
              </div>
              <p className="text-sm text-white/50 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
    </section>
  );
}
