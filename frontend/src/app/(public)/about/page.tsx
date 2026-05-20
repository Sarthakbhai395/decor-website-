import type { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Heart, Award, Users, Star, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Luxe Celebrations — India\'s most luxurious decoration and surprise planning service.',
};

const team = [
  { name: 'Aryan Kapoor', role: 'Founder & Creative Director', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
  { name: 'Priya Sharma', role: 'Head of Decorations', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
  { name: 'Rahul Mehta', role: 'Operations Manager', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80' },
  { name: 'Sneha Patel', role: 'Customer Experience Lead', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-luxury-black pt-24">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80" alt="About" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/50 to-luxury-black" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">Our Story</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mt-3 mb-6">
            Crafting <span className="text-gold-gradient">Unforgettable</span> Moments
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            Founded in 2016, Luxe Celebrations has been transforming ordinary spaces into extraordinary experiences for over 8 years. We believe every celebration deserves to be magical.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: 'Passion', desc: 'Every decoration is crafted with genuine love and attention to detail.' },
              { icon: Award, title: 'Excellence', desc: 'We never compromise on quality — only the finest materials and designs.' },
              { icon: Users, title: 'Personal Touch', desc: 'Every event is unique. We tailor each experience to your vision.' },
              { icon: Star, title: 'Reliability', desc: 'On time, every time. Your trust is our most valuable asset.' },
            ].map((v) => (
              <div key={v.title} className="luxury-card p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-gold-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-white/50">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">The People</span>
            <h2 className="text-4xl font-display font-bold text-white mt-3">
              Meet Our <span className="text-gold-gradient">Team</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="luxury-card p-4 text-center group">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-gold-500/20 group-hover:border-gold-500/50 transition-all">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                <p className="text-xs text-gold-500/70 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
