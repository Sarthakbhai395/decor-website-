'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowLeft, Star, MapPin, Phone, MessageCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const PHONE = '+916306059912';
const WA = '916306059912';

type ServiceItem = {
  id: string; slug: string; title: string; image: string;
  price: number; rating: number; location: string;
  category: string; categoryLabel: string;
};

const CATEGORY_META: Record<string, {
  title: string; description: string; image: string; emoji: string; color: string;
}> = {
  'car-decoration': {
    title: 'Car Decoration',
    description: 'Transform your vehicle into a stunning celebration on wheels. Perfect for anniversaries, birthdays, and special occasions.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80',
    emoji: '🚗', color: 'from-blue-900/60',
  },
  'candlelight-dinner': {
    title: 'Candlelight Dinner',
    description: 'Intimate, romantic dining experiences crafted with premium setups, fairy lights, and exquisite floral arrangements.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
    emoji: '🕯️', color: 'from-amber-900/60',
  },
  'ring-decoration': {
    title: 'Proposal Decoration',
    description: 'Make your proposal unforgettable with breathtaking setups designed to capture the perfect moment.',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&q=80',
    emoji: '💍', color: 'from-pink-900/60',
  },
  'birthday-decorations': {
    title: 'Birthday Decoration',
    description: 'Premium birthday setups with custom themes, balloon art, and personalized touches for every age.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80',
    emoji: '🎂', color: 'from-purple-900/60',
  },
  'anniversary-decorations': {
    title: 'Anniversary Decoration',
    description: 'Celebrate your love story with romantic setups, rose petals, and luxury decorations that speak from the heart.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
    emoji: '💑', color: 'from-rose-900/60',
  },
  'kids-decoration': {
    title: 'Kids Decoration',
    description: 'Magical, colorful, and fun-filled decoration themes that bring joy and wonder to every child\'s special day.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    emoji: '🎈', color: 'from-yellow-900/60',
  },
  'wedding-decoration': {
    title: 'Wedding Decoration',
    description: 'Grand, elegant wedding setups with premium floral arrangements, mandap decor, and breathtaking ambiance.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    emoji: '💒', color: 'from-red-900/60',
  },
  'surprise-decoration': {
    title: 'Surprise Decoration',
    description: 'Carefully planned surprise setups that create unforgettable moments of joy and emotion.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
    emoji: '🎁', color: 'from-green-900/60',
  },
  'corporate-decoration': {
    title: 'Corporate Decoration',
    description: 'Professional, elegant event decoration for corporate gatherings, product launches, and team celebrations.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    emoji: '🏢', color: 'from-slate-900/60',
  },
};

const ALL_CATEGORY_SERVICES: Record<string, ServiceItem[]> = {
  'birthday-decorations': [
    { id: 'b1', slug: 'pastel-rose-gold-birthday', title: 'Pastel & Rose Gold Birthday Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 2999, rating: 5, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
    { id: 'b2', slug: 'delight-birthday-decor', title: 'Delight Birthday Decor', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80', price: 2188, rating: 4.5, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
    { id: 'b3', slug: 'blue-birthday-bliss', title: 'Blue Birthday Bliss Balloon Decor', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 3124, rating: 5, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
    { id: 'b4', slug: 'elegant-birthday-decoration', title: 'Elegant Birthday Decoration', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=80', price: 3249, rating: 5, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
    { id: 'b5', slug: 'golden-birthday-setup', title: 'Golden Glam Birthday Setup', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80', price: 3799, rating: 4.8, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
    { id: 'b6', slug: 'fairy-tale-birthday', title: 'Fairy Tale Birthday Decoration', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 4299, rating: 4.9, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
    { id: 'b7', slug: 'neon-birthday-party', title: 'Neon Glow Birthday Party Decor', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80', price: 4999, rating: 4.7, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
    { id: 'b8', slug: 'princess-birthday-theme', title: 'Princess Birthday Theme Setup', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 3599, rating: 5, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
    { id: 'b9', slug: 'superhero-birthday-decor', title: 'Superhero Birthday Decoration', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=80', price: 2799, rating: 4.6, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
    { id: 'b10', slug: 'luxury-milestone-birthday', title: 'Luxury Milestone Birthday Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 5999, rating: 5, location: 'At Your Location', category: 'birthday-decorations', categoryLabel: 'Birthday' },
  ],
  'anniversary-decorations': [
    { id: 'a1', slug: 'rose-gold-romance-room', title: 'Rose Gold Romance Room Decor', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 3249, rating: 5, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
    { id: 'a2', slug: 'golden-glam-anniversary', title: 'Golden Glam Anniversary Bash', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 2499, rating: 5, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
    { id: 'a3', slug: 'pink-silver-anniversary', title: 'Pink & Silver Anniversary Decor', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80', price: 2749, rating: 5, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
    { id: 'a4', slug: 'i-love-you-balloons-blooms', title: 'I Love You Balloons & Blooms', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80', price: 2749, rating: 5, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
    { id: 'a5', slug: 'romantic-rose-petal-surprise', title: 'Romantic Rose Petal Surprise', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 6999, rating: 4.9, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
    { id: 'a6', slug: 'hotel-room-romantic-surprise', title: 'Hotel Room Romantic Surprise', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80', price: 7999, rating: 4.9, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
    { id: 'a7', slug: 'anniversary-surprise-picnic', title: 'Anniversary Surprise Picnic', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 6999, rating: 4.6, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
    { id: 'a8', slug: 'silver-jubilee-anniversary', title: 'Silver Jubilee Anniversary Setup', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80', price: 9999, rating: 4.8, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
    { id: 'a9', slug: 'candlelit-anniversary-dinner', title: 'Candlelit Anniversary Dinner Setup', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80', price: 5499, rating: 5, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
    { id: 'a10', slug: 'luxury-anniversary-suite', title: 'Luxury Anniversary Suite Decor', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 12999, rating: 5, location: 'At Your Location', category: 'anniversary-decorations', categoryLabel: 'Anniversary' },
  ],
  'candlelight-dinner': [
    { id: 'c1', slug: 'private-dining-experience', title: 'Private Dining Experience', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80', price: 6874, rating: 5, location: 'Sector 104, Noida', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
    { id: 'c2', slug: 'rooftop-candlelight-dinner', title: 'Rooftop Candlelight Dinner', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&q=80', price: 6875, rating: 4.5, location: 'Sector 27, Delhi', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
    { id: 'c3', slug: 'lavish-indoor-dining', title: 'Lavish Indoor Dining', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80', price: 7499, rating: 5, location: 'Noida', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
    { id: 'c4', slug: 'fairy-lights-lantern-dinner', title: 'Fairy Lights & Lantern Dinner', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80', price: 3249, rating: 5, location: 'At Your Location', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
    { id: 'c5', slug: 'poolside-candlelight-dinner', title: 'Poolside Candlelight Dinner', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80', price: 12999, rating: 5, location: 'At Your Location', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
    { id: 'c6', slug: 'terrace-dinner-setup', title: 'Terrace Dinner Setup', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&q=80', price: 8499, rating: 4.8, location: 'Delhi', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
    { id: 'c7', slug: 'garden-candlelight-dinner', title: 'Garden Candlelight Dinner', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80', price: 9999, rating: 4.9, location: 'Faridabad', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
    { id: 'c8', slug: 'floating-candles-dinner', title: 'Floating Candles Dinner Setup', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80', price: 5999, rating: 4.7, location: 'At Your Location', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
    { id: 'c9', slug: 'luxury-suite-dinner', title: 'Luxury Suite Dinner Experience', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80', price: 14999, rating: 5, location: 'Noida', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
    { id: 'c10', slug: 'starlit-dinner-setup', title: 'Starlit Dinner Setup', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&q=80', price: 11499, rating: 4.9, location: 'Ghaziabad', category: 'candlelight-dinner', categoryLabel: 'Candlelight Dinner' },
  ],
  'ring-decoration': [
    { id: 'r1', slug: 'dream-proposal-ring-setup', title: 'Dream Proposal Ring Setup', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&q=80', price: 12999, rating: 5, location: 'At Your Location', category: 'ring-decoration', categoryLabel: 'Proposal' },
    { id: 'r2', slug: 'floral-ring-ceremony-decor', title: 'Floral Ring Ceremony Decor', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80', price: 8999, rating: 4.9, location: 'At Your Location', category: 'ring-decoration', categoryLabel: 'Proposal' },
    { id: 'r3', slug: 'luxury-ring-presentation', title: 'Luxury Ring Presentation Setup', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 15999, rating: 5, location: 'At Your Location', category: 'ring-decoration', categoryLabel: 'Proposal' },
    { id: 'r4', slug: 'intimate-ring-surprise', title: 'Intimate Ring Surprise', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 6999, rating: 4.8, location: 'At Your Location', category: 'ring-decoration', categoryLabel: 'Proposal' },
    { id: 'r5', slug: 'rooftop-proposal-setup', title: 'Rooftop Proposal Setup', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&q=80', price: 18999, rating: 5, location: 'Delhi', category: 'ring-decoration', categoryLabel: 'Proposal' },
    { id: 'r6', slug: 'garden-proposal-decor', title: 'Garden Proposal Decoration', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80', price: 9999, rating: 4.9, location: 'Noida', category: 'ring-decoration', categoryLabel: 'Proposal' },
    { id: 'r7', slug: 'candlelit-proposal-setup', title: 'Candlelit Proposal Setup', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 11499, rating: 5, location: 'At Your Location', category: 'ring-decoration', categoryLabel: 'Proposal' },
    { id: 'r8', slug: 'rose-petal-proposal', title: 'Rose Petal Proposal Decor', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 7499, rating: 4.8, location: 'At Your Location', category: 'ring-decoration', categoryLabel: 'Proposal' },
    { id: 'r9', slug: 'fairy-light-proposal', title: 'Fairy Light Proposal Setup', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&q=80', price: 13999, rating: 5, location: 'Faridabad', category: 'ring-decoration', categoryLabel: 'Proposal' },
    { id: 'r10', slug: 'grand-proposal-experience', title: 'Grand Proposal Experience', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80', price: 24999, rating: 5, location: 'At Your Location', category: 'ring-decoration', categoryLabel: 'Proposal' },
  ],
  'kids-decoration': [
    { id: 'k1', slug: 'rainbow-themed-birthday', title: 'Rainbow Themed Birthday Decor', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80', price: 6874, rating: 5, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids' },
    { id: 'k2', slug: 'mickey-minnie-kids-decor', title: 'Mickey-Minnie Mouse Kids Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 7499, rating: 5, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids' },
    { id: 'k3', slug: 'candy-land-themed-decor', title: 'Delightful Candy Land Themed Decor', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 5374, rating: 5, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids' },
    { id: 'k4', slug: 'adorable-barbie-themed', title: 'Adorable Barbie Themed Decor', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80', price: 10624, rating: 4.6, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids' },
    { id: 'k5', slug: 'jungle-safari-kids-decor', title: 'Jungle Safari Kids Decoration', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80', price: 5999, rating: 4.8, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids' },
    { id: 'k6', slug: 'unicorn-kids-party', title: 'Unicorn Kids Party Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 7999, rating: 5, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids' },
    { id: 'k7', slug: 'dinosaur-kids-theme', title: 'Dinosaur Kids Theme Decoration', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 4999, rating: 4.7, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids' },
    { id: 'k8', slug: 'frozen-princess-decor', title: 'Frozen Princess Decoration', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80', price: 8499, rating: 4.9, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids' },
    { id: 'k9', slug: 'spiderman-kids-party', title: 'Spiderman Kids Party Setup', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80', price: 5499, rating: 4.8, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids' },
    { id: 'k10', slug: 'baby-shower-decoration', title: 'Baby Shower Decoration', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80', price: 5999, rating: 4.8, location: 'At Your Location', category: 'kids-decoration', categoryLabel: 'Kids' },
  ],
  'car-decoration': [
    { id: 'cd1', slug: 'romantic-car-decoration', title: 'Romantic Car Decoration', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80', price: 1999, rating: 4.8, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
    { id: 'cd2', slug: 'anniversary-car-decor', title: 'Anniversary Car Decor', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', price: 2499, rating: 4.9, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
    { id: 'cd3', slug: 'birthday-car-surprise', title: 'Birthday Car Surprise', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&q=80', price: 1799, rating: 4.7, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
    { id: 'cd4', slug: 'luxury-car-floral-decor', title: 'Luxury Car Floral Decor', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80', price: 3499, rating: 5.0, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
    { id: 'cd5', slug: 'wedding-car-decoration', title: 'Wedding Car Decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 4999, rating: 4.9, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
    { id: 'cd6', slug: 'proposal-car-setup', title: 'Proposal Car Setup', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&q=80', price: 5999, rating: 5.0, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
    { id: 'cd7', slug: 'balloon-car-decor', title: 'Balloon Car Decoration', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80', price: 1499, rating: 4.6, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
    { id: 'cd8', slug: 'rose-petal-car-decor', title: 'Rose Petal Car Decoration', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', price: 2999, rating: 4.8, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
    { id: 'cd9', slug: 'honeymoon-car-decor', title: 'Honeymoon Car Decoration', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&q=80', price: 3999, rating: 4.9, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
    { id: 'cd10', slug: 'premium-car-floral-setup', title: 'Premium Car Floral Setup', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80', price: 5499, rating: 5, location: 'At Your Location', category: 'car-decoration', categoryLabel: 'Car Decor' },
  ],
  'wedding-decoration': [
    { id: 'wd1', slug: 'grand-wedding-decoration', title: 'Grand Wedding Decoration Package', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80', price: 39999, rating: 4.7, location: 'At Your Location', category: 'wedding-decoration', categoryLabel: 'Wedding' },
    { id: 'wd2', slug: 'floral-wedding-mandap', title: 'Floral Wedding Mandap Setup', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80', price: 29999, rating: 4.8, location: 'At Your Location', category: 'wedding-decoration', categoryLabel: 'Wedding' },
    { id: 'wd3', slug: 'royal-wedding-decor', title: 'Royal Wedding Decor', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80', price: 49999, rating: 5.0, location: 'At Your Location', category: 'wedding-decoration', categoryLabel: 'Wedding' },
    { id: 'wd4', slug: 'intimate-wedding-setup', title: 'Intimate Wedding Setup', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 14999, rating: 4.9, location: 'At Your Location', category: 'wedding-decoration', categoryLabel: 'Wedding' },
    { id: 'wd5', slug: 'garden-wedding-decor', title: 'Garden Wedding Decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 24999, rating: 4.8, location: 'At Your Location', category: 'wedding-decoration', categoryLabel: 'Wedding' },
    { id: 'wd6', slug: 'destination-wedding-decor', title: 'Destination Wedding Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 59999, rating: 5.0, location: 'At Your Location', category: 'wedding-decoration', categoryLabel: 'Wedding' },
    { id: 'wd7', slug: 'mehndi-ceremony-decor', title: 'Mehndi Ceremony Decoration', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80', price: 12999, rating: 4.8, location: 'Delhi', category: 'wedding-decoration', categoryLabel: 'Wedding' },
    { id: 'wd8', slug: 'sangeet-night-decor', title: 'Sangeet Night Decoration', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80', price: 19999, rating: 4.9, location: 'Noida', category: 'wedding-decoration', categoryLabel: 'Wedding' },
    { id: 'wd9', slug: 'haldi-ceremony-decor', title: 'Haldi Ceremony Decoration', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80', price: 9999, rating: 4.7, location: 'Faridabad', category: 'wedding-decoration', categoryLabel: 'Wedding' },
    { id: 'wd10', slug: 'reception-hall-decor', title: 'Reception Hall Decoration', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 34999, rating: 5, location: 'Ghaziabad', category: 'wedding-decoration', categoryLabel: 'Wedding' },
  ],
  'surprise-decoration': [
    { id: 'sd1', slug: 'midnight-surprise-setup', title: 'Midnight Surprise Setup', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 3999, rating: 4.9, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise' },
    { id: 'sd2', slug: 'hotel-room-surprise', title: 'Hotel Room Surprise Decor', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80', price: 7999, rating: 4.9, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise' },
    { id: 'sd3', slug: 'balloon-surprise-setup', title: 'Balloon Surprise Setup', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 2999, rating: 4.8, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise' },
    { id: 'sd4', slug: 'romantic-surprise-picnic', title: 'Romantic Surprise Picnic', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 6999, rating: 4.7, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise' },
    { id: 'sd5', slug: 'birthday-surprise-room', title: 'Birthday Surprise Room Decor', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 4499, rating: 4.8, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise' },
    { id: 'sd6', slug: 'anniversary-surprise-setup', title: 'Anniversary Surprise Setup', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80', price: 8999, rating: 5.0, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise' },
    { id: 'sd7', slug: 'flash-mob-surprise', title: 'Flash Mob Surprise Planning', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 14999, rating: 4.9, location: 'Delhi', category: 'surprise-decoration', categoryLabel: 'Surprise' },
    { id: 'sd8', slug: 'treasure-hunt-surprise', title: 'Treasure Hunt Surprise Setup', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80', price: 5999, rating: 4.7, location: 'Noida', category: 'surprise-decoration', categoryLabel: 'Surprise' },
    { id: 'sd9', slug: 'photo-wall-surprise', title: 'Photo Wall Surprise Decoration', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 3499, rating: 4.8, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise' },
    { id: 'sd10', slug: 'grand-surprise-party', title: 'Grand Surprise Party Setup', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 11999, rating: 5, location: 'At Your Location', category: 'surprise-decoration', categoryLabel: 'Surprise' },
  ],
  'corporate-decoration': [
    { id: 'corp1', slug: 'corporate-event-decor', title: 'Corporate Event Decoration', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80', price: 14999, rating: 4.8, location: 'At Your Location', category: 'corporate-decoration', categoryLabel: 'Corporate' },
    { id: 'corp2', slug: 'product-launch-decor', title: 'Product Launch Decoration', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80', price: 24999, rating: 4.9, location: 'At Your Location', category: 'corporate-decoration', categoryLabel: 'Corporate' },
    { id: 'corp3', slug: 'office-party-decor', title: 'Office Party Decoration', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 9999, rating: 4.7, location: 'At Your Location', category: 'corporate-decoration', categoryLabel: 'Corporate' },
    { id: 'corp4', slug: 'award-ceremony-decor', title: 'Award Ceremony Decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 19999, rating: 4.9, location: 'At Your Location', category: 'corporate-decoration', categoryLabel: 'Corporate' },
    { id: 'corp5', slug: 'conference-decor', title: 'Conference Room Decoration', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 7999, rating: 4.6, location: 'At Your Location', category: 'corporate-decoration', categoryLabel: 'Corporate' },
    { id: 'corp6', slug: 'team-celebration-decor', title: 'Team Celebration Decoration', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 11999, rating: 4.8, location: 'At Your Location', category: 'corporate-decoration', categoryLabel: 'Corporate' },
    { id: 'corp7', slug: 'annual-day-decor', title: 'Annual Day Decoration', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80', price: 29999, rating: 4.9, location: 'Delhi', category: 'corporate-decoration', categoryLabel: 'Corporate' },
    { id: 'corp8', slug: 'seminar-decor', title: 'Seminar & Workshop Decoration', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80', price: 6999, rating: 4.7, location: 'Noida', category: 'corporate-decoration', categoryLabel: 'Corporate' },
    { id: 'corp9', slug: 'brand-activation-decor', title: 'Brand Activation Decoration', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 34999, rating: 5, location: 'Ghaziabad', category: 'corporate-decoration', categoryLabel: 'Corporate' },
    { id: 'corp10', slug: 'gala-dinner-decor', title: 'Gala Dinner Decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 44999, rating: 5, location: 'Faridabad', category: 'corporate-decoration', categoryLabel: 'Corporate' },
  ],
};

// ─── Service Card (no wishlist) ───────────────────────────────────────────────
function CategoryServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: (index % 5) * 0.07 }}
    >
      <Link href={`/services/${service.slug}`}>
        <div className="luxury-card group cursor-pointer h-full flex flex-col hover:-translate-y-1 transition-transform duration-200">
          {/* Image */}
          <div className="relative h-44 sm:h-52 overflow-hidden rounded-t-2xl flex-shrink-0">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading={index < 4 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            {/* Rating badge */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-gold-500/30">
              <Star className="w-2.5 h-2.5 text-gold-500 fill-gold-500" />
              <span className="text-[10px] text-white font-semibold">{service.rating}</span>
            </div>
          </div>
          {/* Content */}
          <div className="p-3 sm:p-4 flex flex-col flex-1">
            <div className="flex items-center gap-1 text-[10px] text-white/40 mb-1.5">
              <MapPin className="w-2.5 h-2.5 text-gold-500/60 flex-shrink-0" />
              <span className="truncate">{service.location}</span>
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-2 mb-2 flex-1">
              {service.title}
            </h3>
            <div className="flex items-center justify-between mt-auto gap-2">
              <p className="text-sm font-bold text-gold-500">{formatCurrency(service.price)}</p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `tel:${PHONE}`; }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-luxury-black"
                  style={{ background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' }}
                  aria-label="Call Now"
                >
                  <Phone className="w-2.5 h-2.5" />
                  <span>Call</span>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I'm interested in: ${service.title}`)}`, '_blank');
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                  style={{ background: '#25D366' }}
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-2.5 h-2.5 fill-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const meta = CATEGORY_META[slug as string] || {
    title: (slug as string)?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Category',
    description: 'Explore our premium decoration services for this category.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80',
    emoji: '✨', color: 'from-gray-900/60',
  };

  const services = ALL_CATEGORY_SERVICES[slug as string] || [];
  const displayServices = services.length > 0 ? services.slice(0, 10) : [];

  return (
    <div className="min-h-screen bg-luxury-black pt-16 sm:pt-20">
      {/* Hero Banner */}
      <div className="relative h-52 sm:h-72 lg:h-96 overflow-hidden">
        <img src={meta.image} alt={meta.title} className="w-full h-full object-cover" loading="eager" />
        <div className={`absolute inset-0 bg-gradient-to-b ${meta.color} via-black/50 to-black/95`} />
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs text-white/60 hover:text-gold-400 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />Back
              </button>
              <span className="text-white/30 text-xs">/</span>
              <span className="text-xs text-gold-500/80">Categories</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-4xl sm:text-5xl">{meta.emoji}</span>
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-white">{meta.title}</h1>
                <p className="text-white/60 text-sm mt-1.5 max-w-xl">{meta.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6" />

        {displayServices.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {displayServices.map((service, i) => (
              <CategoryServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
            <p className="text-white/40 text-sm mb-6">We&apos;re adding amazing services for this category.</p>
            <Link href="/contact" className="btn-luxury text-sm px-6 py-2.5">Contact Us</Link>
          </div>
        )}
      </div>
    </div>
  );
}
