'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, MessageCircle, Send, Sparkles, CheckCircle } from 'lucide-react';

const PHONE = '+916306059912';
const WA = '916306059912';

const cities = ['Delhi', 'Noida', 'Ghaziabad', 'Faridabad'];

function ContactBlast({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      {/* Confetti particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 3 === 0 ? '#c9a96e' : i % 3 === 1 ? '#25D366' : '#fff',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 1.5, 0], opacity: [1, 1, 0], y: [0, -80 - Math.random() * 80] }}
          transition={{ duration: 1.2, delay: i * 0.05 }}
        />
      ))}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="relative rounded-3xl p-8 text-center max-w-sm w-full"
        style={{ background: 'rgba(17,17,17,0.97)', border: '1px solid rgba(201,169,110,0.3)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-8 h-8 text-gold-500" />
        </motion.div>
        <h3 className="text-xl font-display font-bold text-white mb-2">Message Sent!</h3>
        <p className="text-white/60 text-sm mb-6">We&apos;ll get back to you within 30 minutes. Our team is ready to plan your perfect celebration!</p>
        <div className="flex gap-3">
          <a
            href={`tel:${PHONE}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-luxury-black"
            style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 100%)' }}
          >
            <Phone className="w-4 h-4" /> Call Now
          </a>
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I just submitted a contact form. Can you help me plan a decoration?")}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: '#25D366' }}
          >
            <MessageCircle className="w-4 h-4 fill-white" /> WhatsApp
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-luxury-black pt-20">
      {/* ── Hero ── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80" alt="Contact" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/70 to-luxury-black" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">Get In Touch</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mt-3 mb-4">
              Let&apos;s Plan Your <span className="text-gold-gradient">Perfect Moment</span>
            </h1>
            <p className="text-white/50 max-w-2xl mx-auto text-lg">
              Our decoration experts are available 9 AM – 10 PM, 7 days a week across Delhi, Noida, Ghaziabad & Faridabad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Quick Contact Buttons ── */}
      <section className="py-8 bg-luxury-dark border-y border-gold-500/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`tel:${PHONE}`}
              className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-luxury-black text-base transition-all hover:opacity-90 active:scale-98"
              style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' }}
            >
              <Phone className="w-5 h-5" />
              Call: +91 63060 59912
            </a>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'd like to book a decoration service.")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90"
              style={{ background: '#25D366' }}
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              WhatsApp: +91 63060 59912
            </a>
          </div>
        </div>
      </section>

      {/* ── Services Available ── */}
      <section className="py-12 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-display font-bold text-white mb-6 text-center">
              Services Available In <span className="text-gold-gradient">Delhi NCR</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {cities.map((city) => (
                <div key={city} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/5">
                  <MapPin className="w-3.5 h-3.5 text-gold-500" />
                  <span className="text-sm text-white font-medium">{city}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Main Content: Form + Info ── */}
      <section className="py-16 bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Form */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: -40 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="luxury-card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold text-white">Book a Decoration</h2>
                    <p className="text-xs text-white/40">We reply within 30 minutes</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Rahul Sharma"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">City *</label>
                      <select
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#111]">Select City</option>
                        {cities.map((c) => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">Service Type</label>
                      <select
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#111]">Select Service</option>
                        {['Birthday Decoration', 'Anniversary Decoration', 'Proposal Decoration', 'Candlelight Dinner', 'Wedding Decoration', 'Kids Decoration', 'Car Decoration', 'Surprise Decoration', 'Corporate Event'].map((s) => (
                          <option key={s} value={s} className="bg-[#111]">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/50 mb-1.5 block">Your Message</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your celebration — date, venue, theme, budget..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-luxury flex items-center justify-center gap-2 py-3.5 text-sm font-bold disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-4 h-4 rounded-full border-2 border-luxury-black/30 border-t-luxury-black animate-spin" />
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-6"
            >
              <div className="luxury-card p-6 sm:p-8">
                <h2 className="text-lg font-display font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-5">
                  {[
                    { icon: Phone, label: 'Phone', value: '+91 63060 59912', href: `tel:${PHONE}` },
                    { icon: MessageCircle, label: 'WhatsApp', value: '+91 63060 59912', href: `https://wa.me/${WA}` },
                    { icon: Mail, label: 'Email', value: 'hello@meltingeve.com', href: 'mailto:hello@meltingeve.com' },
                    { icon: MapPin, label: 'Address', value: 'D-216, Hyperfocus Building, Sector 63, Noida, UP 201301', href: '#' },
                    { icon: Clock, label: 'Hours', value: 'Mon–Sun: 9 AM – 10 PM', href: '#' },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <a key={label} href={href} className="flex items-start gap-4 group" target={href.startsWith('https') ? '_blank' : undefined} rel="noopener noreferrer">
                      <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 transition-colors">
                        <Icon className="w-4 h-4 text-gold-500" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-0.5">{label}</p>
                        <p className="text-sm text-white group-hover:text-gold-500 transition-colors">{value}</p>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
                  {[Instagram, Facebook].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 rounded-full glass-dark border border-gold-500/20 flex items-center justify-center text-white/50 hover:text-gold-500 hover:border-gold-500/50 transition-all">
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Cities served */}
              <div className="luxury-card p-6">
                <h3 className="text-sm font-semibold text-gold-500 uppercase tracking-wider mb-4">We Serve</h3>
                <div className="grid grid-cols-2 gap-3">
                  {cities.map((city) => (
                    <div key={city} className="flex items-center gap-2 text-sm text-white/70">
                      <MapPin className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                      {city}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Map ── */}
      <section className="py-12 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-display font-bold text-white mb-4">
                Find Us at <span className="text-gold-gradient">Sector 63, Noida</span>
              </h2>
              <div className="rounded-2xl overflow-hidden border border-gold-500/20" style={{ height: '360px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.3710!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sSector%2063%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Melting Eve Location"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="luxury-card p-5">
                <h3 className="text-sm font-semibold text-gold-500 mb-3">Our Location</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  D-216, Hyperfocus Building<br />
                  Sector 63, Noida<br />
                  Uttar Pradesh 201301
                </p>
              </div>
              <div className="luxury-card p-5">
                <h3 className="text-sm font-semibold text-gold-500 mb-3">Service Areas</h3>
                <ul className="space-y-2">
                  {cities.map((city) => (
                    <li key={city} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      {city} & surrounding areas
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blast animation on submit */}
      <AnimatePresence>
        {submitted && <ContactBlast onClose={() => setSubmitted(false)} />}
      </AnimatePresence>
    </div>
  );
}
