import Link from 'next/link';
import { Sparkles, Instagram, Facebook, Twitter, Youtube, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const PHONE_NUMBER = '+916306059912';
const WA_NUMBER = '916306059912';

const footerLinks = {
  services: [
    { label: 'Balloon Decorations', href: '/categories/birthday-decorations' },
    { label: 'Birthday Setups', href: '/categories/birthday-decorations' },
    { label: 'Anniversary Decor', href: '/categories/anniversary-decorations' },
    { label: 'Proposal Planning', href: '/categories/ring-decoration' },
    { label: 'Candlelight Dinner', href: '/categories/candlelight-dinner' },
    { label: 'Wedding Decor', href: '/categories/wedding-decoration' },
    { label: 'Kids Decoration', href: '/categories/kids-decoration' },
    { label: 'Car Decoration', href: '/categories/car-decoration' },
    { label: 'Surprise Decoration', href: '/categories/surprise-decoration' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'FAQ', href: '/faq' },
  ],
};

const cities = ['Delhi', 'Noida', 'Ghaziabad', 'Faridabad'];

export default function Footer() {
  return (
    <footer className="relative bg-luxury-black border-t border-gold-500/10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold-500/3 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-luxury-black" />
              </div>
              <span className="text-xl font-display font-bold text-gold-gradient" style={{ textShadow: '0 0 20px rgba(201,169,110,0.5)', letterSpacing: '0.02em' }}>
                Melting Eve
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Transforming ordinary moments into extraordinary memories. Premium decoration and surprise planning service across Delhi NCR.
            </p>

            {/* Contact */}
            <div className="space-y-3">
              <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-3 text-sm text-white/50 hover:text-gold-500 transition-colors">
                <Phone className="w-4 h-4 text-gold-500" />
                +91 63060 59912
              </a>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! I'd like to book a decoration service.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-white/50 hover:text-gold-500 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-green-400" />
                WhatsApp: +91 63060 59912
              </a>
              <a href="mailto:hello@meltingeve.com" className="flex items-center gap-3 text-sm text-white/50 hover:text-gold-500 transition-colors">
                <Mail className="w-4 h-4 text-gold-500" />
                hello@meltingeve.com
              </a>
              <div className="flex items-start gap-3 text-sm text-white/50">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <span>D-216, Hyperfocus Building, Sector 63, Noida, UP 201301</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full glass-dark border border-gold-500/20 flex items-center justify-center text-white/50 hover:text-gold-500 hover:border-gold-500/50 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-gold-500 uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gold-500 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gold-500 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cities */}
        <div className="border-t border-white/5 pt-8 mb-8">
          <h3 className="text-xs font-semibold text-gold-500/70 uppercase tracking-wider mb-4">
            We Serve
          </h3>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <span
                key={city}
                className="text-xs text-white/40 px-3 py-1 rounded-full border border-white/10"
              >
                {city}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Melting Eve. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Crafted with ❤️ for unforgettable moments
          </p>
        </div>
      </div>
    </footer>
  );
}
