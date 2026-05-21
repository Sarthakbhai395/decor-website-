import type { Metadata } from 'next';
import FAQAccordion from '@/components/shared/FAQAccordion';

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Questions',
  description: 'Find answers to common questions about our luxury decoration and surprise planning services.',
};

const faqs = [
  {
    question: 'How far in advance should I book?',
    answer: 'We recommend booking at least 3–7 days in advance to ensure availability. For peak dates (Valentine\'s Day, New Year\'s Eve, etc.), we suggest booking 2–4 weeks ahead.',
  },
  {
    question: 'What areas do you serve?',
    answer: 'We currently serve 4 cities across Delhi NCR: Delhi, Noida, Ghaziabad, and Faridabad. Our dedicated local teams ensure premium service across all these locations.',
  },
  {
    question: 'Can I customize a package?',
    answer: 'Absolutely! All our packages are fully customizable. You can add or remove elements, choose specific colors, themes, and add personal touches. Contact us to discuss your vision.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellations made 48+ hours before the event receive a full refund. Cancellations within 24–48 hours receive a 50% refund. No refund for cancellations within 24 hours.',
  },
  {
    question: 'How long does the setup take?',
    answer: 'Setup time varies by package — typically 1–3 hours. Our team will coordinate with the venue and arrive well in advance to ensure everything is perfect before you arrive.',
  },
  {
    question: 'Do you provide photography?',
    answer: 'Some premium packages include a professional photographer. You can also add photography as an add-on to any package. Ask us for details.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept Razorpay (UPI, cards, net banking), Stripe (international cards), and Cash on Delivery for select packages.',
  },
  {
    question: 'Can you decorate hotel rooms?',
    answer: 'Yes! Hotel room decoration is one of our specialties. We coordinate directly with the hotel to set up the decoration before your arrival. We work with all major hotel chains.',
  },
  {
    question: 'Do you offer same-day bookings?',
    answer: 'Same-day bookings are available subject to team availability. Please call us directly for urgent requests and we\'ll do our best to accommodate you.',
  },
  {
    question: 'What if I\'m not satisfied with the decoration?',
    answer: 'Your satisfaction is our priority. If you\'re not happy with the setup, please let us know immediately and we\'ll make it right. We offer a 100% satisfaction guarantee.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-luxury-black pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <span className="text-gold-500 text-sm font-medium tracking-widest uppercase">Help Center</span>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mt-3 mb-4">
            Frequently Asked <span className="text-gold-gradient">Questions</span>
          </h1>
          <div className="section-divider" />
        </div>
        <FAQAccordion faqs={faqs} />
      </div>
    </div>
  );
}
