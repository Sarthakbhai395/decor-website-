'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Search, Calendar, Sparkles, Heart } from 'lucide-react';

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Choose Your Experience',
    description: 'Browse our curated collection of luxury decoration packages and find the perfect one for your occasion.',
    color: 'text-gold-500',
    bg: 'bg-gold-500/10',
    border: 'border-gold-500/30',
  },
  {
    icon: Calendar,
    step: '02',
    title: 'Book Your Date',
    description: 'Select your preferred date, time slot, and location. Our team will confirm availability instantly.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  {
    icon: Sparkles,
    step: '03',
    title: 'We Create Magic',
    description: 'Our expert decorators arrive and transform your space into a breathtaking luxury experience.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
  },
  {
    icon: Heart,
    step: '04',
    title: 'Cherish the Moment',
    description: 'Enjoy your perfectly crafted celebration and create memories that last a lifetime.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
];

export default function HowItWorks() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-luxury-dark relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            How It{' '}
            <span className="text-gold-gradient">Works</span>
          </h2>
          <div className="section-divider" />
          <p className="text-white/50 max-w-2xl mx-auto mt-4">
            From booking to celebration — we make the entire process seamless and stress-free.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-gold-500/20 via-gold-500/50 to-gold-500/20" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative text-center group"
            >
              {/* Icon */}
              <div className="relative inline-flex mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center relative z-10`}
                >
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                </motion.div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gold-gradient flex items-center justify-center">
                  <span className="text-[10px] font-bold text-luxury-black">{step.step}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-gold-500 transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
