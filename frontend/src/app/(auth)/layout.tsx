import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-luxury-black flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80"
          alt="Luxury Celebrations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/80 to-luxury-black/40" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-luxury-black" />
            </div>
            <span className="text-xl font-display font-bold text-gold-gradient" style={{ textShadow: '0 0 20px rgba(201,169,110,0.5)' }}>Melting Eve</span>
          </Link>

          <div>
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Create Magical{' '}
              <span className="text-gold-gradient">Moments</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-md">
              Join thousands of couples who have trusted us to make their special occasions truly unforgettable.
            </p>

            <div className="flex items-center gap-6 mt-8">
              {[
                { value: '5000+', label: 'Happy Clients' },
                { value: '4.9★', label: 'Rating' },
                { value: '4', label: 'Cities' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-gold-500">{stat.value}</div>
                  <div className="text-xs text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-luxury-black" />
              </div>
              <span className="text-xl font-display font-bold text-gold-gradient" style={{ textShadow: '0 0 20px rgba(201,169,110,0.5)' }}>Melting Eve</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
