'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Award, Users, Star, Sparkles, Phone, MessageCircle, MapPin, Clock, CheckCircle, Zap, Shield, Smile } from 'lucide-react';
import Link from 'next/link';

const PHONE = '+916306059912';
const WA = '916306059912';

const stats = [
  { value: '5000+', label: 'Celebrations Crafted' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '4', label: 'Cities Served' },
  { value: '8+', label: 'Years of Excellence' },
];

const values = [
  { icon: Heart, title: 'Passion', desc: 'Every decoration is crafted with genuine love and meticulous attention to detail. We pour our hearts into every setup.' },
  { icon: Award, title: 'Excellence', desc: 'We never compromise on quality — only the finest materials, freshest flowers, and most premium designs make the cut.' },
  { icon: Users, title: 'Personal Touch', desc: 'Every event is unique. We tailor each experience to your vision, your story, and your special moment.' },
  { icon: Star, title: 'Reliability', desc: 'On time, every time. Your trust is our most valuable asset. We show up and deliver, no matter what.' },
  { icon: Zap, title: 'Speed', desc: 'Same-day bookings available. Our agile team can set up a stunning decoration in as little as 3 hours.' },
  { icon: Shield, title: 'Trust', desc: 'Fully insured, background-verified team. Your home and venue are in safe, professional hands.' },
  { icon: Smile, title: 'Joy', desc: 'We don\'t just decorate spaces — we create emotions, memories, and moments that last a lifetime.' },
  { icon: CheckCircle, title: 'Guarantee', desc: '100% satisfaction guaranteed. If you\'re not happy, we\'ll make it right — no questions asked.' },
];

const team = [
  { name: 'Aryan Kapoor', role: 'Founder & Creative Director', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', bio: 'Visionary behind Melting Eve with 10+ years in luxury event design.' },
  { name: 'Priya Sharma', role: 'Head of Decorations', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80', bio: 'Award-winning decorator specializing in floral and balloon artistry.' },
  { name: 'Rahul Mehta', role: 'Operations Manager', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80', bio: 'Ensures every setup is delivered on time with zero compromise.' },
  { name: 'Sneha Patel', role: 'Customer Experience Lead', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80', bio: 'Dedicated to making every client feel heard, valued, and delighted.' },
];

const milestones = [
  { year: '2016', title: 'Founded', desc: 'Started with a single team and a dream to make celebrations magical in Noida.' },
  { year: '2018', title: 'Expanded to Delhi', desc: 'Grew our team and brought luxury decoration services to the capital.' },
  { year: '2020', title: '1000+ Celebrations', desc: 'Crossed the milestone of 1000 successful events despite challenging times.' },
  { year: '2022', title: 'Ghaziabad & Faridabad', desc: 'Expanded to cover all of Delhi NCR with dedicated local teams.' },
  { year: '2024', title: '5000+ Happy Clients', desc: 'Became the most trusted decoration brand across Delhi NCR.' },
];

const services = [
  { emoji: '🎂', name: 'Birthday Decoration', cities: 'Delhi, Noida, Ghaziabad, Faridabad' },
  { emoji: '💑', name: 'Anniversary Decoration', cities: 'Delhi, Noida, Ghaziabad, Faridabad' },
  { emoji: '💍', name: 'Proposal Decoration', cities: 'Delhi, Noida, Ghaziabad, Faridabad' },
  { emoji: '🕯️', name: 'Candlelight Dinner', cities: 'Delhi, Noida, Ghaziabad, Faridabad' },
  { emoji: '💒', name: 'Wedding Decoration', cities: 'Delhi, Noida, Ghaziabad, Faridabad' },
  { emoji: '🎈', name: 'Kids Decoration', cities: 'Delhi, Noida, Ghaziabad, Faridabad' },
  { emoji: '🚗', name: 'Car Decoration', cities: 'Delhi, Noida, Ghaziabad, Faridabad' },
  { emoji: '🎁', name: 'Surprise Decoration', cities: 'Delhi, Noida, Ghaziabad, Faridabad' },
  { emoji: '🏢', name: 'Corporate Events', cities: 'Delhi, Noida, Ghaziabad, Faridabad' },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-luxury-black">
      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80"
            alt="About Melting Eve"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/60 via-luxury-black/40 to-luxury-black" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 text-gold-500 text-sm font-medium tracking-widest uppercase mb-4">
              <Sparkles className="w-4 h-4" /> Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mt-2 mb-6 leading-tight">
              Crafting <span className="text-gold-gradient">Unforgettable</span><br />Moments Since 2016
            </h1>
            <p className="text-lg sm:text-xl text-white/60 leading-relaxed max-w-3xl mx-auto mb-8">
              We are Melting Eve — Delhi NCR&apos;s most trusted luxury decoration and surprise planning service. From intimate candlelight dinners to grand wedding setups, we transform ordinary spaces into extraordinary memories.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href={`tel:${PHONE}`} className="btn-luxury flex items-center gap-2 px-6 py-3">
                <Phone className="w-4 h-4" /> Call Us Now
              </a>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'd like to know more about Melting Eve.")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#25D366' }}
              >
                <MessageCircle className="w-4 h-4 fill-white" /> WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-luxury-dark border-y border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-display font-bold text-gold-gradient mb-2">{s.value}</p>
                  <p className="text-sm text-white/50">{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Mission ── */}
      <section className="py-20 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">Our Mission</span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-3 mb-6">
                  We Don&apos;t Just Decorate — <span className="text-gold-gradient">We Create Magic</span>
                </h2>
                <p className="text-white/60 leading-relaxed mb-4">
                  At Melting Eve, we believe that every celebration deserves to be extraordinary. Whether it&apos;s a surprise birthday for your best friend, a romantic proposal for the love of your life, or a grand wedding that your family will talk about for generations — we pour our heart and soul into every single setup.
                </p>
                <p className="text-white/60 leading-relaxed mb-4">
                  Our team of passionate decorators, floral artists, and event specialists work tirelessly to understand your vision and bring it to life with premium materials, creative designs, and flawless execution.
                </p>
                <p className="text-white/60 leading-relaxed mb-6">
                  We serve Delhi, Noida, Ghaziabad, and Faridabad — covering all of Delhi NCR with dedicated local teams who know the area, the venues, and the people.
                </p>
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  <span>D-216, Hyperfocus Building, Sector 63, Noida</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/50 mt-2">
                  <Clock className="w-4 h-4 text-gold-500" />
                  <span>Available 9 AM – 10 PM, 7 days a week</span>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80" alt="Birthday Decoration" className="rounded-2xl w-full h-48 object-cover" />
                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80" alt="Anniversary Decoration" className="rounded-2xl w-full h-48 object-cover mt-8" />
                <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=80" alt="Proposal Decoration" className="rounded-2xl w-full h-48 object-cover -mt-4" />
                <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80" alt="Candlelight Dinner" className="rounded-2xl w-full h-48 object-cover mt-4" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">What We Stand For</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-3">
                Our Core <span className="text-gold-gradient">Values</span>
              </h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.07}>
                <div className="luxury-card p-6 text-center group hover:-translate-y-1 transition-transform duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/20 transition-colors">
                    <v.icon className="w-6 h-6 text-gold-500" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Journey / Timeline ── */}
      <section className="py-20 bg-luxury-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">Our Journey</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-3">
                From Dream to <span className="text-gold-gradient">Reality</span>
              </h2>
            </div>
          </FadeIn>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gold-500/20" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <FadeIn key={m.year} delay={i * 0.1}>
                  <div className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center z-10">
                      <span className="text-xs font-bold text-gold-500">{m.year}</span>
                    </div>
                    <div className="luxury-card p-5 flex-1">
                      <h3 className="text-base font-semibold text-white mb-1">{m.title}</h3>
                      <p className="text-sm text-white/50">{m.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services We Offer ── */}
      <section className="py-20 bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">What We Do</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-3">
                Services Available Across <span className="text-gold-gradient">Delhi NCR</span>
              </h2>
              <p className="text-white/50 text-sm mt-3 max-w-xl mx-auto">
                All services available in Delhi, Noida, Ghaziabad & Faridabad
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <FadeIn key={s.name} delay={i * 0.06}>
                <div className="luxury-card p-5 flex items-center gap-4 group hover:-translate-y-0.5 transition-transform">
                  <span className="text-3xl">{s.emoji}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors">{s.name}</h3>
                    <p className="text-xs text-white/40 mt-0.5">{s.cities}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">The People</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-3">
                Meet Our <span className="text-gold-gradient">Team</span>
              </h2>
              <p className="text-white/50 text-sm mt-3 max-w-xl mx-auto">
                A passionate group of creatives, planners, and perfectionists dedicated to making your celebration unforgettable.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.1}>
                <div className="luxury-card p-5 text-center group hover:-translate-y-1 transition-transform duration-200">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-gold-500/20 group-hover:border-gold-500/60 transition-all">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                  <p className="text-xs text-gold-500/70 mt-1 mb-2">{member.role}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{member.bio}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
                alt="Why Choose Melting Eve"
                className="rounded-3xl w-full h-80 object-cover"
              />
            </FadeIn>
            <FadeIn delay={0.2}>
              <div>
                <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">Why Us</span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-3 mb-6">
                  The Melting Eve <span className="text-gold-gradient">Difference</span>
                </h2>
                <ul className="space-y-4">
                  {[
                    'Same-day booking available — we can set up in 3 hours',
                    'Premium quality materials — fresh flowers, LED lights, satin draping',
                    'Experienced team of 50+ certified decorators',
                    'Serving Delhi, Noida, Ghaziabad & Faridabad',
                    '100% satisfaction guarantee — we make it right',
                    'Transparent pricing — no hidden charges',
                    'Free consultation and customization',
                    'Post-event cleanup included in every package',
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-white/70">
                      <CheckCircle className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-luxury-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <Sparkles className="w-10 h-10 text-gold-500 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Ready to Create Your <span className="text-gold-gradient">Perfect Moment?</span>
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              Let&apos;s plan something extraordinary together. Our team is available 9 AM – 10 PM, 7 days a week across Delhi, Noida, Ghaziabad & Faridabad.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href={`tel:${PHONE}`} className="btn-luxury flex items-center gap-2 px-8 py-3.5">
                <Phone className="w-4 h-4" /> Call: +91 63060 59912
              </a>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'd like to book a decoration service.")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#25D366' }}
              >
                <MessageCircle className="w-4 h-4 fill-white" /> WhatsApp Us
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/40">
              <MapPin className="w-4 h-4 text-gold-500" />
              D-216, Hyperfocus Building, Sector 63, Noida
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
