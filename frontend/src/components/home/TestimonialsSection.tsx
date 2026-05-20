'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Priya & Rahul',
    occasion: 'Anniversary Surprise',
    rating: 5,
    comment: 'Absolutely magical! The team transformed our hotel room into a fairytale. Every detail was perfect — from the rose petals to the candles. We were speechless!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    city: 'Mumbai',
  },
  {
    name: 'Arjun Sharma',
    occasion: 'Proposal Setup',
    rating: 5,
    comment: 'She said YES! The proposal setup was beyond my imagination. The team was professional, punctual, and the decoration was breathtaking. Worth every penny!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    city: 'Delhi',
  },
  {
    name: 'Sneha Patel',
    occasion: 'Birthday Decoration',
    rating: 5,
    comment: 'My husband surprised me with the most beautiful birthday setup. The balloon arch, the fairy lights, the personalized touches — I cried happy tears!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    city: 'Bangalore',
  },
  {
    name: 'Vikram & Ananya',
    occasion: 'Candlelight Dinner',
    rating: 5,
    comment: 'The candlelight dinner setup by the pool was absolutely romantic. The attention to detail was incredible. Our 5th anniversary was truly unforgettable.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    city: 'Hyderabad',
  },
  {
    name: 'Meera Krishnan',
    occasion: 'Baby Welcome',
    rating: 5,
    comment: 'The baby welcome decoration was so adorable and thoughtful. Every guest was amazed. The team was so sweet and made the whole experience special.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    city: 'Chennai',
  },
  {
    name: 'Rohan Mehta',
    occasion: 'Wedding Decor',
    rating: 5,
    comment: 'Our wedding venue looked like something out of a dream. The floral arrangements, the lighting, the overall ambiance — Luxe Celebrations exceeded all expectations!',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    city: 'Pune',
  },
];

export default function TestimonialsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-luxury-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">
            Love Stories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            What Our{' '}
            <span className="text-gold-gradient">Clients Say</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Swiper */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial, i) => (
              <SwiperSlide key={i}>
                {/* No whileHover inside Swiper — causes jank during touch swipe */}
                <div className="luxury-card p-5 sm:p-6 h-full">
                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 text-gold-500/30 mb-4" />

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-gold-500 fill-gold-500" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-4">
                    &ldquo;{testimonial.comment}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-auto">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gold-500/30"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                      <p className="text-xs text-gold-500/70">{testimonial.occasion} · {testimonial.city}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
