import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import NavigationPopup from '@/components/shared/NavigationPopup';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-[72px] md:pb-0">{children}</main>
      <Footer />
      <WhatsAppButton />
      <NavigationPopup />
      <MobileBottomNav />
    </>
  );
}
