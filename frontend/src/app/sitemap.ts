import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://luxecelebrations.com';

  const staticPages = [
    '',
    '/about',
    '/services',
    '/categories',
    '/contact',
    '/blog',
    '/faq',
    '/privacy-policy',
    '/terms',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  return staticPages;
}
