import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import QuickCategories from '@/components/home/QuickCategories';
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

      {/* 2. Quick category circles (Birthday, Kids, Candlelight, Anniversary, Ring, Sequin) */}
      <QuickCategories />

      {/* 3. Featured Experiences grid */}
      <FeaturedServices />

      {/* 4. Category-wise horizontal service rows */}
      <CategoryServiceRows />

      {/* 5. Stats bar */}
      <StatsSection />

      {/* 6. Testimonials */}
      <TestimonialsSection />

      {/* 7. CTA */}
      <CTASection />
    </>
  );
}
