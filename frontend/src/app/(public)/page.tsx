import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import LuxeSection from '@/components/home/LuxeSection';
import BrowseCategories from '@/components/home/BrowseCategories';
import FeaturedServices from '@/components/home/FeaturedServices';
import CategoryServiceRows from '@/components/home/CategoryServiceRows';
import StatsSection from '@/components/home/StatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  title: 'Melting Eve — Premium Decoration & Surprise Planning',
  description:
    "Delhi NCR's most luxurious decoration and surprise planning service. Balloon decorations, romantic setups, birthday surprises, anniversary celebrations & more. Serving Delhi, Noida, Ghaziabad & Faridabad.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero slider */}
      <HeroSection />

      {/* 2. Browse Categories — 3×3 grid */}
      <BrowseCategories />

      {/* 3. Highlighted Luxe Featured Section */}
      <LuxeSection />

      {/* 4. Featured Experiences marquee */}
      <FeaturedServices />

      {/* 5. Category-wise horizontal service rows */}
      <CategoryServiceRows />

      {/* 6. Stats bar */}
      <StatsSection />

      {/* 7. Testimonials */}
      <TestimonialsSection />

      {/* 8. CTA */}
      <CTASection />
    </>
  );
}
