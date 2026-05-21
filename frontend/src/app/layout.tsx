import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: false,
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: false,
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://meltingeve.com'
  ),
  title: {
    default: 'Melting Eve — Premium Decoration & Surprise Planning',
    template: '%s | Melting Eve',
  },
  description:
    "Delhi NCR's most luxurious decoration and surprise planning service. Balloon decorations, romantic setups, birthday surprises, anniversary celebrations, proposal planning & more. Serving Delhi, Noida, Ghaziabad & Faridabad.",
  keywords: [
    'luxury decoration',
    'surprise planning',
    'balloon decoration',
    'romantic setup',
    'birthday decoration',
    'anniversary decoration',
    'proposal planning',
    'candlelight dinner',
    'hotel room decoration',
    'wedding decor',
    'decoration in noida',
    'decoration in delhi',
    'decoration in ghaziabad',
    'decoration in faridabad',
    'melting eve',
  ],
  authors: [{ name: 'Melting Eve' }],
  creator: 'Melting Eve',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://meltingeve.com',
    siteName: 'Melting Eve',
    title: 'Melting Eve — Premium Decoration & Surprise Planning',
    description:
      "Transform every moment into a masterpiece with Delhi NCR's most luxurious decoration service.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Melting Eve',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Melting Eve',
    description: 'Premium decoration & surprise planning in Delhi NCR',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}
    >
      <body className="min-h-screen bg-background antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(201,169,110,0.3)',
                borderRadius: '12px',
                fontFamily: 'var(--font-inter)',
              },
              success: {
                iconTheme: { primary: '#c9a96e', secondary: '#0a0a0a' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
