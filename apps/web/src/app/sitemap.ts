import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

/**
 * Dynamic Sitemap Generator
 * 
 * Generates sitemap.xml with:
 * - Home page (all locales)
 * - All article pages (all locales)
 * - Category pages
 * 
 * @route /sitemap.xml
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://news-app.uz';
const LOCALES = ['uz', 'ru', 'en'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all published articles
  const articles = await prisma.article.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 1000, // Limit for performance
  });

  // Get all categories
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
    },
  });

  const sitemap: MetadataRoute.Sitemap = [];

  // Home pages for each locale
  for (const locale of LOCALES) {
    sitemap.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    });
  }

  // Article pages for each locale
  for (const article of articles) {
    for (const locale of LOCALES) {
      sitemap.push({
        url: `${BASE_URL}/${locale}/articles/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Category pages for each locale
  for (const category of categories) {
    for (const locale of LOCALES) {
      sitemap.push({
        url: `${BASE_URL}/${locale}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.6,
      });
    }
  }

  return sitemap;
}
