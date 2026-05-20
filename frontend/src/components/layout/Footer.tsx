import Link from 'next/link';
import { Sparkles, Instagram, Facebook, Twitter, Youtube, Phone, Mail, MapPin } from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'Balloon Decorations', href: '/services/balloon-decorations' },
    { label: 'Birthday Setups', href: '/services/birthday-decorations' },
    { label: 'Anniversary Decor', href: '/services/anniversary-decorations' },
    { label: 'Proposal Planning', href: '/services/proposal-planning' },
    { label: 'Candlelight Dinner', href: '/services/candlelight-dinner' },
    { label: 'Wedding Decor', href: '/services/wedding-decor' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Blog', href: '/blog' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'FAQ', href: '/faq' },
  ],
};

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Goa',
];

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
              <div>
                <span className="text-xl font-display font-bold text-gold-gradient">Luxe</span>
                <span className="text-xl font-display font-light text-white ml-1">Celebrations</span>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Transforming ordinary moments into extraordinary memories. India&apos;s most luxurious
              decoration and surprise planning service.
            </p>

            {/* Contact */}
            <div className="space-y-3">
              <a href="tel:+919999999999" className="flex items-center gap-3 text-sm text-white/50 hover:text-gold-500 transition-colors">
                <Phone className="w-4 h-4 text-gold-500" />
                +91 99999 99999
              </a>
              <a href="mailto:hello@luxecelebrations.com" className="flex items-center gap-3 text-sm text-white/50 hover:text-gold-500 transition-colors">
                <Mail className="w-4 h-4 text-gold-500" />
                hello@luxecelebrations.com
              </a>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                Mumbai, Maharashtra, India
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
              <Link
                key={city}
                href={`/cities/${city.toLowerCase()}`}
                className="text-xs text-white/40 hover:text-gold-500 transition-colors px-3 py-1 rounded-full border border-white/10 hover:border-gold-500/30"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Luxe Celebrations. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Crafted with ❤️ for unforgettable moments
          </p>
        </div>
      </div>
    </footer>
  );
}
