import type { Metadata } from 'next';
import ContactForm from '@/components/shared/ContactForm';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Luxe Celebrations for bookings, inquiries, and support.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-luxury-black pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">Get In Touch</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            Contact <span className="text-gold-gradient">Us</span>
          </h1>
          <div className="section-divider" />
          <p className="text-white/50 max-w-2xl mx-auto mt-4">
            Have a question or ready to book? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="luxury-card p-8">
              <h2 className="text-xl font-display font-bold text-white mb-6">Get In Touch</h2>
              <div className="space-y-5">
                {[
                  { icon: Phone, label: 'Phone', value: '+91 99999 99999', href: 'tel:+919999999999' },
                  { icon: Mail, label: 'Email', value: 'hello@luxecelebrations.com', href: 'mailto:hello@luxecelebrations.com' },
                  { icon: MapPin, label: 'Address', value: 'Mumbai, Maharashtra, India', href: '#' },
                  { icon: Clock, label: 'Hours', value: 'Mon–Sun: 9 AM – 9 PM', href: '#' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <a key={label} href={href} className="flex items-start gap-4 group">
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
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
