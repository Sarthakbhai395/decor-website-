'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Star, ChevronDown, Phone, Clock, Users, Wifi, WifiOff, MessageCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { IService, ICategory, ICity, ServiceFilters } from '@/types';
import { formatCurrency, getDiscountPercentage } from '@/lib/utils';
import api from '@/lib/axios';
import ServiceCardSkeleton from '@/components/shared/ServiceCardSkeleton';

const STATIC_DATE = '2024-01-01T00:00:00.000Z';
const PHONE = '+916306059912';
const WA = '916306059912';

const FALLBACK_CATEGORIES: ICategory[] = [
  { _id: '1', name: 'Anniversary',  slug: 'anniversary-decorations',  description: '', image: { url: '', publicId: '' }, icon: '💑', isActive: true, order: 1 },
  { _id: '2', name: 'Birthday',     slug: 'birthday-decorations',     description: '', image: { url: '', publicId: '' }, icon: '🎂', isActive: true, order: 2 },
  { _id: '3', name: 'Proposal',     slug: 'ring-decoration',          description: '', image: { url: '', publicId: '' }, icon: '💍', isActive: true, order: 3 },
  { _id: '4', name: 'Wedding',      slug: 'wedding-decoration',       description: '', image: { url: '', publicId: '' }, icon: '💒', isActive: true, order: 4 },
  { _id: '5', name: 'Candlelight',  slug: 'candlelight-dinner',       description: '', image: { url: '', publicId: '' }, icon: '🕯️', isActive: true, order: 5 },
  { _id: '6', name: 'Kids',         slug: 'kids-decoration',          description: '', image: { url: '', publicId: '' }, icon: '🎈', isActive: true, order: 6 },
  { _id: '7', name: 'Car Decor',    slug: 'car-decoration',           description: '', image: { url: '', publicId: '' }, icon: '🚗', isActive: true, order: 7 },
  { _id: '8', name: 'Surprise',     slug: 'surprise-decoration',      description: '', image: { url: '', publicId: '' }, icon: '🎁', isActive: true, order: 8 },
  { _id: '9', name: 'Corporate',    slug: 'corporate-decoration',     description: '', image: { url: '', publicId: '' }, icon: '🏢', isActive: true, order: 9 },
];

const FALLBACK_CITIES: ICity[] = [
  { _id: '1', name: 'Delhi',      slug: 'delhi',      state: 'Delhi',   image: { url: '', publicId: '' }, isActive: true, serviceCount: 120 },
  { _id: '2', name: 'Noida',      slug: 'noida',      state: 'UP',      image: { url: '', publicId: '' }, isActive: true, serviceCount: 95 },
  { _id: '3', name: 'Ghaziabad',  slug: 'ghaziabad',  state: 'UP',      image: { url: '', publicId: '' }, isActive: true, serviceCount: 75 },
  { _id: '4', name: 'Faridabad',  slug: 'faridabad',  state: 'Haryana', image: { url: '', publicId: '' }, isActive: true, serviceCount: 60 },
];

/* ─── All 90 Decoration Services (10 per category × 9 categories) ─────── */
type StaticService = {
  id: string; slug: string; title: string; image: string;
  price: number; rating: number; location: string;
  categoryId: string; categoryLabel: string;
};

const ALL_STATIC_SERVICES: StaticService[] = [
  // Birthday (10)
  { id: 'b1', slug: 'pastel-rose-gold-birthday', title: 'Pastel & Rose Gold Birthday Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 2999, rating: 5, location: 'At Your Location', categoryId: '2', categoryLabel: 'Birthday' },
  { id: 'b2', slug: 'delight-birthday-decor', title: 'Delight Birthday Decor', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80', price: 2188, rating: 4.5, location: 'At Your Location', categoryId: '2', categoryLabel: 'Birthday' },
  { id: 'b3', slug: 'blue-birthday-bliss', title: 'Blue Birthday Bliss Balloon Decor', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 3124, rating: 5, location: 'At Your Location', categoryId: '2', categoryLabel: 'Birthday' },
  { id: 'b4', slug: 'elegant-birthday-decoration', title: 'Elegant Birthday Decoration', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=80', price: 3249, rating: 5, location: 'At Your Location', categoryId: '2', categoryLabel: 'Birthday' },
  { id: 'b5', slug: 'golden-birthday-setup', title: 'Golden Glam Birthday Setup', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80', price: 3799, rating: 4.8, location: 'At Your Location', categoryId: '2', categoryLabel: 'Birthday' },
  { id: 'b6', slug: 'fairy-tale-birthday', title: 'Fairy Tale Birthday Decoration', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 4299, rating: 4.9, location: 'At Your Location', categoryId: '2', categoryLabel: 'Birthday' },
  { id: 'b7', slug: 'neon-birthday-party', title: 'Neon Glow Birthday Party Decor', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80', price: 4999, rating: 4.7, location: 'At Your Location', categoryId: '2', categoryLabel: 'Birthday' },
  { id: 'b8', slug: 'princess-birthday-theme', title: 'Princess Birthday Theme Setup', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 3599, rating: 5, location: 'At Your Location', categoryId: '2', categoryLabel: 'Birthday' },
  { id: 'b9', slug: 'superhero-birthday-decor', title: 'Superhero Birthday Decoration', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=80', price: 2799, rating: 4.6, location: 'At Your Location', categoryId: '2', categoryLabel: 'Birthday' },
  { id: 'b10', slug: 'luxury-milestone-birthday', title: 'Luxury Milestone Birthday Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 5999, rating: 5, location: 'At Your Location', categoryId: '2', categoryLabel: 'Birthday' },
  // Anniversary (10)
  { id: 'a1', slug: 'rose-gold-romance-room', title: 'Rose Gold Romance Room Decor', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 3249, rating: 5, location: 'At Your Location', categoryId: '1', categoryLabel: 'Anniversary' },
  { id: 'a2', slug: 'golden-glam-anniversary', title: 'Golden Glam Anniversary Bash', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 2499, rating: 5, location: 'At Your Location', categoryId: '1', categoryLabel: 'Anniversary' },
  { id: 'a3', slug: 'pink-silver-anniversary', title: 'Pink & Silver Anniversary Decor', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80', price: 2749, rating: 5, location: 'At Your Location', categoryId: '1', categoryLabel: 'Anniversary' },
  { id: 'a4', slug: 'i-love-you-balloons-blooms', title: 'I Love You Balloons & Blooms', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80', price: 2749, rating: 5, location: 'At Your Location', categoryId: '1', categoryLabel: 'Anniversary' },
  { id: 'a5', slug: 'romantic-rose-petal-surprise', title: 'Romantic Rose Petal Surprise', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 6999, rating: 4.9, location: 'At Your Location', categoryId: '1', categoryLabel: 'Anniversary' },
  { id: 'a6', slug: 'hotel-room-romantic-surprise', title: 'Hotel Room Romantic Surprise', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80', price: 7999, rating: 4.9, location: 'At Your Location', categoryId: '1', categoryLabel: 'Anniversary' },
  { id: 'a7', slug: 'anniversary-surprise-picnic', title: 'Anniversary Surprise Picnic', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 6999, rating: 4.6, location: 'At Your Location', categoryId: '1', categoryLabel: 'Anniversary' },
  { id: 'a8', slug: 'silver-jubilee-anniversary', title: 'Silver Jubilee Anniversary Setup', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80', price: 9999, rating: 4.8, location: 'At Your Location', categoryId: '1', categoryLabel: 'Anniversary' },
  { id: 'a9', slug: 'candlelit-anniversary-dinner', title: 'Candlelit Anniversary Dinner Setup', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80', price: 5499, rating: 5, location: 'At Your Location', categoryId: '1', categoryLabel: 'Anniversary' },
  { id: 'a10', slug: 'luxury-anniversary-suite', title: 'Luxury Anniversary Suite Decor', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 12999, rating: 5, location: 'At Your Location', categoryId: '1', categoryLabel: 'Anniversary' },
  // Candlelight Dinner (10)
  { id: 'c1', slug: 'private-dining-experience', title: 'Private Dining Experience', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80', price: 6874, rating: 5, location: 'Sector 104, Noida', categoryId: '5', categoryLabel: 'Candlelight' },
  { id: 'c2', slug: 'rooftop-candlelight-dinner', title: 'Rooftop Candlelight Dinner', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&q=80', price: 6875, rating: 4.5, location: 'Sector 27, Delhi', categoryId: '5', categoryLabel: 'Candlelight' },
  { id: 'c3', slug: 'lavish-indoor-dining', title: 'Lavish Indoor Dining', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80', price: 7499, rating: 5, location: 'Noida', categoryId: '5', categoryLabel: 'Candlelight' },
  { id: 'c4', slug: 'fairy-lights-lantern-dinner', title: 'Fairy Lights & Lantern Dinner', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80', price: 3249, rating: 5, location: 'At Your Location', categoryId: '5', categoryLabel: 'Candlelight' },
  { id: 'c5', slug: 'poolside-candlelight-dinner', title: 'Poolside Candlelight Dinner', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80', price: 12999, rating: 5, location: 'At Your Location', categoryId: '5', categoryLabel: 'Candlelight' },
  { id: 'c6', slug: 'terrace-dinner-setup', title: 'Terrace Dinner Setup', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&q=80', price: 8499, rating: 4.8, location: 'Delhi', categoryId: '5', categoryLabel: 'Candlelight' },
  { id: 'c7', slug: 'garden-candlelight-dinner', title: 'Garden Candlelight Dinner', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80', price: 9999, rating: 4.9, location: 'Faridabad', categoryId: '5', categoryLabel: 'Candlelight' },
  { id: 'c8', slug: 'floating-candles-dinner', title: 'Floating Candles Dinner Setup', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80', price: 5999, rating: 4.7, location: 'At Your Location', categoryId: '5', categoryLabel: 'Candlelight' },
  { id: 'c9', slug: 'luxury-suite-dinner', title: 'Luxury Suite Dinner Experience', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80', price: 14999, rating: 5, location: 'Noida', categoryId: '5', categoryLabel: 'Candlelight' },
  { id: 'c10', slug: 'starlit-dinner-setup', title: 'Starlit Dinner Setup', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&q=80', price: 11499, rating: 4.9, location: 'Ghaziabad', categoryId: '5', categoryLabel: 'Candlelight' },
  // Proposal (10)
  { id: 'r1', slug: 'dream-proposal-ring-setup', title: 'Dream Proposal Ring Setup', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&q=80', price: 12999, rating: 5, location: 'At Your Location', categoryId: '3', categoryLabel: 'Proposal' },
  { id: 'r2', slug: 'floral-ring-ceremony-decor', title: 'Floral Ring Ceremony Decor', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80', price: 8999, rating: 4.9, location: 'At Your Location', categoryId: '3', categoryLabel: 'Proposal' },
  { id: 'r3', slug: 'luxury-ring-presentation', title: 'Luxury Ring Presentation Setup', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 15999, rating: 5, location: 'At Your Location', categoryId: '3', categoryLabel: 'Proposal' },
  { id: 'r4', slug: 'intimate-ring-surprise', title: 'Intimate Ring Surprise', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 6999, rating: 4.8, location: 'At Your Location', categoryId: '3', categoryLabel: 'Proposal' },
  { id: 'r5', slug: 'rooftop-proposal-setup', title: 'Rooftop Proposal Setup', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&q=80', price: 18999, rating: 5, location: 'Delhi', categoryId: '3', categoryLabel: 'Proposal' },
  { id: 'r6', slug: 'garden-proposal-decor', title: 'Garden Proposal Decoration', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80', price: 9999, rating: 4.9, location: 'Noida', categoryId: '3', categoryLabel: 'Proposal' },
  { id: 'r7', slug: 'candlelit-proposal-setup', title: 'Candlelit Proposal Setup', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 11499, rating: 5, location: 'At Your Location', categoryId: '3', categoryLabel: 'Proposal' },
  { id: 'r8', slug: 'rose-petal-proposal', title: 'Rose Petal Proposal Decor', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 7499, rating: 4.8, location: 'At Your Location', categoryId: '3', categoryLabel: 'Proposal' },
  { id: 'r9', slug: 'fairy-light-proposal', title: 'Fairy Light Proposal Setup', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&q=80', price: 13999, rating: 5, location: 'Faridabad', categoryId: '3', categoryLabel: 'Proposal' },
  { id: 'r10', slug: 'grand-proposal-experience', title: 'Grand Proposal Experience', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80', price: 24999, rating: 5, location: 'At Your Location', categoryId: '3', categoryLabel: 'Proposal' },
  // Kids (10)
  { id: 'k1', slug: 'rainbow-themed-birthday', title: 'Rainbow Themed Birthday Decor', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80', price: 6874, rating: 5, location: 'At Your Location', categoryId: '6', categoryLabel: 'Kids' },
  { id: 'k2', slug: 'mickey-minnie-kids-decor', title: 'Mickey-Minnie Mouse Kids Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 7499, rating: 5, location: 'At Your Location', categoryId: '6', categoryLabel: 'Kids' },
  { id: 'k3', slug: 'candy-land-themed-decor', title: 'Delightful Candy Land Themed Decor', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 5374, rating: 5, location: 'At Your Location', categoryId: '6', categoryLabel: 'Kids' },
  { id: 'k4', slug: 'adorable-barbie-themed', title: 'Adorable Barbie Themed Decor', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80', price: 10624, rating: 4.6, location: 'At Your Location', categoryId: '6', categoryLabel: 'Kids' },
  { id: 'k5', slug: 'jungle-safari-kids-decor', title: 'Jungle Safari Kids Decoration', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80', price: 5999, rating: 4.8, location: 'At Your Location', categoryId: '6', categoryLabel: 'Kids' },
  { id: 'k6', slug: 'unicorn-kids-party', title: 'Unicorn Kids Party Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 7999, rating: 5, location: 'At Your Location', categoryId: '6', categoryLabel: 'Kids' },
  { id: 'k7', slug: 'dinosaur-kids-theme', title: 'Dinosaur Kids Theme Decoration', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 4999, rating: 4.7, location: 'At Your Location', categoryId: '6', categoryLabel: 'Kids' },
  { id: 'k8', slug: 'frozen-princess-decor', title: 'Frozen Princess Decoration', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80', price: 8499, rating: 4.9, location: 'At Your Location', categoryId: '6', categoryLabel: 'Kids' },
  { id: 'k9', slug: 'spiderman-kids-party', title: 'Spiderman Kids Party Setup', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80', price: 5499, rating: 4.8, location: 'At Your Location', categoryId: '6', categoryLabel: 'Kids' },
  { id: 'k10', slug: 'baby-shower-decoration', title: 'Baby Shower Decoration', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80', price: 5999, rating: 4.8, location: 'At Your Location', categoryId: '6', categoryLabel: 'Kids' },
  // Car Decoration (10)
  { id: 'cd1', slug: 'romantic-car-decoration', title: 'Romantic Car Decoration', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80', price: 1999, rating: 4.8, location: 'At Your Location', categoryId: '7', categoryLabel: 'Car Decor' },
  { id: 'cd2', slug: 'anniversary-car-decor', title: 'Anniversary Car Decor', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', price: 2499, rating: 4.9, location: 'At Your Location', categoryId: '7', categoryLabel: 'Car Decor' },
  { id: 'cd3', slug: 'birthday-car-surprise', title: 'Birthday Car Surprise', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&q=80', price: 1799, rating: 4.7, location: 'At Your Location', categoryId: '7', categoryLabel: 'Car Decor' },
  { id: 'cd4', slug: 'luxury-car-floral-decor', title: 'Luxury Car Floral Decor', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80', price: 3499, rating: 5.0, location: 'At Your Location', categoryId: '7', categoryLabel: 'Car Decor' },
  { id: 'cd5', slug: 'wedding-car-decoration', title: 'Wedding Car Decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 4999, rating: 4.9, location: 'At Your Location', categoryId: '7', categoryLabel: 'Car Decor' },
  { id: 'cd6', slug: 'proposal-car-setup', title: 'Proposal Car Setup', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&q=80', price: 5999, rating: 5.0, location: 'At Your Location', categoryId: '7', categoryLabel: 'Car Decor' },
  { id: 'cd7', slug: 'balloon-car-decor', title: 'Balloon Car Decoration', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80', price: 1499, rating: 4.6, location: 'At Your Location', categoryId: '7', categoryLabel: 'Car Decor' },
  { id: 'cd8', slug: 'rose-petal-car-decor', title: 'Rose Petal Car Decoration', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', price: 2999, rating: 4.8, location: 'At Your Location', categoryId: '7', categoryLabel: 'Car Decor' },
  { id: 'cd9', slug: 'honeymoon-car-decor', title: 'Honeymoon Car Decoration', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&q=80', price: 3999, rating: 4.9, location: 'At Your Location', categoryId: '7', categoryLabel: 'Car Decor' },
  { id: 'cd10', slug: 'premium-car-floral-setup', title: 'Premium Car Floral Setup', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80', price: 5499, rating: 5, location: 'At Your Location', categoryId: '7', categoryLabel: 'Car Decor' },
  // Wedding (10)
  { id: 'wd1', slug: 'grand-wedding-decoration', title: 'Grand Wedding Decoration Package', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80', price: 39999, rating: 4.7, location: 'At Your Location', categoryId: '4', categoryLabel: 'Wedding' },
  { id: 'wd2', slug: 'floral-wedding-mandap', title: 'Floral Wedding Mandap Setup', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80', price: 29999, rating: 4.8, location: 'At Your Location', categoryId: '4', categoryLabel: 'Wedding' },
  { id: 'wd3', slug: 'royal-wedding-decor', title: 'Royal Wedding Decor', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80', price: 49999, rating: 5.0, location: 'At Your Location', categoryId: '4', categoryLabel: 'Wedding' },
  { id: 'wd4', slug: 'intimate-wedding-setup', title: 'Intimate Wedding Setup', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 14999, rating: 4.9, location: 'At Your Location', categoryId: '4', categoryLabel: 'Wedding' },
  { id: 'wd5', slug: 'garden-wedding-decor', title: 'Garden Wedding Decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 24999, rating: 4.8, location: 'At Your Location', categoryId: '4', categoryLabel: 'Wedding' },
  { id: 'wd6', slug: 'destination-wedding-decor', title: 'Destination Wedding Decor', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 59999, rating: 5.0, location: 'At Your Location', categoryId: '4', categoryLabel: 'Wedding' },
  { id: 'wd7', slug: 'mehndi-ceremony-decor', title: 'Mehndi Ceremony Decoration', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80', price: 12999, rating: 4.8, location: 'Delhi', categoryId: '4', categoryLabel: 'Wedding' },
  { id: 'wd8', slug: 'sangeet-night-decor', title: 'Sangeet Night Decoration', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80', price: 19999, rating: 4.9, location: 'Noida', categoryId: '4', categoryLabel: 'Wedding' },
  { id: 'wd9', slug: 'haldi-ceremony-decor', title: 'Haldi Ceremony Decoration', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&q=80', price: 9999, rating: 4.7, location: 'Faridabad', categoryId: '4', categoryLabel: 'Wedding' },
  { id: 'wd10', slug: 'reception-hall-decor', title: 'Reception Hall Decoration', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 34999, rating: 5, location: 'Ghaziabad', categoryId: '4', categoryLabel: 'Wedding' },
  // Surprise (10)
  { id: 'sd1', slug: 'midnight-surprise-setup', title: 'Midnight Surprise Setup', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 3999, rating: 4.9, location: 'At Your Location', categoryId: '8', categoryLabel: 'Surprise' },
  { id: 'sd2', slug: 'hotel-room-surprise', title: 'Hotel Room Surprise Decor', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80', price: 7999, rating: 4.9, location: 'At Your Location', categoryId: '8', categoryLabel: 'Surprise' },
  { id: 'sd3', slug: 'balloon-surprise-setup', title: 'Balloon Surprise Setup', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 2999, rating: 4.8, location: 'At Your Location', categoryId: '8', categoryLabel: 'Surprise' },
  { id: 'sd4', slug: 'romantic-surprise-picnic', title: 'Romantic Surprise Picnic', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 6999, rating: 4.7, location: 'At Your Location', categoryId: '8', categoryLabel: 'Surprise' },
  { id: 'sd5', slug: 'birthday-surprise-room', title: 'Birthday Surprise Room Decor', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 4499, rating: 4.8, location: 'At Your Location', categoryId: '8', categoryLabel: 'Surprise' },
  { id: 'sd6', slug: 'anniversary-surprise-setup', title: 'Anniversary Surprise Setup', image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&q=80', price: 8999, rating: 5.0, location: 'At Your Location', categoryId: '8', categoryLabel: 'Surprise' },
  { id: 'sd7', slug: 'flash-mob-surprise', title: 'Flash Mob Surprise Planning', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 14999, rating: 4.9, location: 'Delhi', categoryId: '8', categoryLabel: 'Surprise' },
  { id: 'sd8', slug: 'treasure-hunt-surprise', title: 'Treasure Hunt Surprise Setup', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80', price: 5999, rating: 4.7, location: 'Noida', categoryId: '8', categoryLabel: 'Surprise' },
  { id: 'sd9', slug: 'photo-wall-surprise', title: 'Photo Wall Surprise Decoration', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 3499, rating: 4.8, location: 'At Your Location', categoryId: '8', categoryLabel: 'Surprise' },
  { id: 'sd10', slug: 'grand-surprise-party', title: 'Grand Surprise Party Setup', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 11999, rating: 5, location: 'At Your Location', categoryId: '8', categoryLabel: 'Surprise' },
  // Corporate (10)
  { id: 'corp1', slug: 'corporate-event-decor', title: 'Corporate Event Decoration', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80', price: 14999, rating: 4.8, location: 'At Your Location', categoryId: '9', categoryLabel: 'Corporate' },
  { id: 'corp2', slug: 'product-launch-decor', title: 'Product Launch Decoration', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80', price: 24999, rating: 4.9, location: 'At Your Location', categoryId: '9', categoryLabel: 'Corporate' },
  { id: 'corp3', slug: 'office-party-decor', title: 'Office Party Decoration', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 9999, rating: 4.7, location: 'At Your Location', categoryId: '9', categoryLabel: 'Corporate' },
  { id: 'corp4', slug: 'award-ceremony-decor', title: 'Award Ceremony Decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 19999, rating: 4.9, location: 'At Your Location', categoryId: '9', categoryLabel: 'Corporate' },
  { id: 'corp5', slug: 'conference-decor', title: 'Conference Room Decoration', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80', price: 7999, rating: 4.6, location: 'At Your Location', categoryId: '9', categoryLabel: 'Corporate' },
  { id: 'corp6', slug: 'team-celebration-decor', title: 'Team Celebration Decoration', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', price: 11999, rating: 4.8, location: 'At Your Location', categoryId: '9', categoryLabel: 'Corporate' },
  { id: 'corp7', slug: 'annual-day-decor', title: 'Annual Day Decoration', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80', price: 29999, rating: 4.9, location: 'Delhi', categoryId: '9', categoryLabel: 'Corporate' },
  { id: 'corp8', slug: 'seminar-decor', title: 'Seminar & Workshop Decoration', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80', price: 6999, rating: 4.7, location: 'Noida', categoryId: '9', categoryLabel: 'Corporate' },
  { id: 'corp9', slug: 'brand-activation-decor', title: 'Brand Activation Decoration', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&q=80', price: 34999, rating: 5, location: 'Ghaziabad', categoryId: '9', categoryLabel: 'Corporate' },
  { id: 'corp10', slug: 'gala-dinner-decor', title: 'Gala Dinner Decoration', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', price: 44999, rating: 5, location: 'Faridabad', categoryId: '9', categoryLabel: 'Corporate' },
];

const PRICE_MAX = 60000;
const PRICE_MIN = 999;

// ─── Page ─────────────────────────────────────────────────────────────────────
function ServicesContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<ICategory[]>(FALLBACK_CATEGORIES);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt-desc');

  // Read URL query params on mount
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCat(catParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchMeta = async () => {
      setCategories(FALLBACK_CATEGORIES);
    };
    fetchMeta();
  }, []);

  // Filter & sort the static services based on selection
  const filteredStaticServices = useMemo(() => {
    let result = [...ALL_STATIC_SERVICES];

    // Category filter
    if (selectedCat !== 'all') {
      result = result.filter(s => s.categoryId === selectedCat || s.categoryLabel.toLowerCase().replace(' ', '-') === selectedCat || s.slug.includes(selectedCat));
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.title.toLowerCase().includes(q) || s.categoryLabel.toLowerCase().includes(q));
    }

    // Sort
    const [sortField, sortOrder] = sortBy.split('-');
    if (sortField === 'price') {
      result.sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price);
    } else if (sortField === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCat, searchQuery, sortBy]);

  const displayedServices = filteredStaticServices;

  return (
    <div className="min-h-screen bg-luxury-black pt-14 sm:pt-16">
      {/* Compact Header */}
      <div className="bg-luxury-dark border-b border-gold-500/10 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-gold-500 text-xs font-medium tracking-widest uppercase">All Services</span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1.5 mb-1">
              Luxury <span className="text-gold-gradient">Experiences</span>
            </h1>
            <p className="text-white/40 text-sm">
              {filteredStaticServices.length} premium decoration & surprise planning services across Delhi NCR.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* ── Category Filter Pills ── */}
        <div className="mb-5">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            <button
              suppressHydrationWarning
              onClick={() => setSelectedCat('all')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                selectedCat === 'all'
                  ? 'text-luxury-black'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:border-gold-500/30 hover:text-white'
              }`}
              style={selectedCat === 'all' ? { background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' } : {}}
            >
              ✨ All ({ALL_STATIC_SERVICES.length})
            </button>
            {FALLBACK_CATEGORIES.map((cat) => {
              const count = ALL_STATIC_SERVICES.filter(s => s.categoryId === cat._id).length;
              return (
                <button
                  key={cat._id}
                  suppressHydrationWarning
                  onClick={() => setSelectedCat(selectedCat === cat._id ? 'all' : cat._id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    selectedCat === cat._id
                      ? 'text-luxury-black'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:border-gold-500/30 hover:text-white'
                  }`}
                  style={selectedCat === cat._id ? { background: 'linear-gradient(135deg, #c9a96e 0%, #f0d080 50%, #c9a96e 100%)' } : {}}
                >
                  {cat.icon} {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Search & Sort Bar ── */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Search decorations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-all"
            />
            {searchQuery && (
              <button
                suppressHydrationWarning
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="relative w-full sm:w-48">
            <select
              suppressHydrationWarning
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all cursor-pointer"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-white/40">
            {filteredStaticServices.length} decorations found
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredStaticServices.map((service, i) => (
            <StaticServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* Empty state */}
        {filteredStaticServices.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-base font-semibold text-white mb-1.5">No services found</h3>
            <p className="text-white/40 text-sm mb-5">Try adjusting your filters</p>
            <button onClick={() => { setSelectedCat('all'); setSearchQuery(''); }} className="btn-luxury text-sm px-5 py-2">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
          <p className="text-white/50 text-sm animate-pulse">Loading experiences...</p>
        </div>
      </div>
    }>
      <ServicesContent />
    </Suspense>
  );
}

// ─── Static Service Card ──────────────────────────────────────────────────────
function StaticServiceCard({ service, index }: { service: StaticService; index: number }) {
  return (
    <Link href={`/services/${service.slug}`}>
      <div className="luxury-card group cursor-pointer h-full flex flex-col hover:-translate-y-1 transition-transform duration-200">
        {/* Image */}
        <div className="relative h-40 sm:h-48 overflow-hidden rounded-t-2xl flex-shrink-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading={index < 8 ? 'eager' : 'lazy'}
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Rating */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-gold-500/30">
            <Star className="w-2.5 h-2.5 text-gold-500 fill-gold-500" />
            <span className="text-[10px] text-white font-semibold">{service.rating}</span>
          </div>

          {/* Category label */}
          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/50 border border-white/10">
            <span className="text-[9px] text-gold-500/80 font-medium">{service.categoryLabel}</span>
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
                suppressHydrationWarning
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
  );
}
