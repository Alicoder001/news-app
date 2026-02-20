import { MetadataRoute } from 'next';
import { getArticleSlugs, getCategories } from '@/lib/api/server-api';

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
  let articles: Array<{ slug: string; updatedAt: string }> = [];
  let categories: Array<{ slug: string }> = [];
  try {
    const [articleResponse, categoryResponse] = await Promise.all([
      getArticleSlugs(1000),
      getCategories(),
    ]);
    articles = (articleResponse.data.articles as Array<{ slug: string; updatedAt: string }>) ?? [];
    categories = (categoryResponse.data.categories as Array<{ slug: string }>) ?? [];
  } catch {
    articles = [];
    categories = [];
  }

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
        lastModified: new Date(article.updatedAt),
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
