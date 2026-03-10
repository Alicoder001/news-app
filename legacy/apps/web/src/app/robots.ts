import { MetadataRoute } from 'next';

/**
 * Robots.txt Generator
 * 
 * SEO-friendly robots configuration
 * 
 * @route /robots.txt
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://news-app.uz';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/tg/', // Telegram Mini App - internal only
          '/_next/',
        ],
      },
      // Googlebot specific rules
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/tg/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
