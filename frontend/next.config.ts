import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Allow mobile/other devices on the local network to access the dev server
  allowedDevOrigins: [
    '192.168.0.113',
    '192.168.0.*',
    '192.168.*.*',
    '10.0.*.*',
    '172.16.*.*',
  ],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
};

export default nextConfig;
