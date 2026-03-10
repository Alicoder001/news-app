/**
 * SEO Utilities
 * 
 * Professional SEO tools for better Google indexing:
 * - Meta tags generation
 * - JSON-LD structured data
 * - Keyword extraction
 * - Open Graph tags
 * 
 * @author Antigravity Team
 * @version 1.0.0
 */

import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://news-app.uz';
const SITE_NAME = 'Aishunos';
const DEFAULT_DESCRIPTION = "O'zbekiston IT hamjamiyati uchun sun'iy intellekt yordamida tayyorlangan texnologiya yangiliklari";

/**
 * Default keywords for IT news
 */
export const DEFAULT_KEYWORDS = [
  'IT yangiliklar',
  'texnologiya',
  "sun'iy intellekt",
  'AI',
  'dasturlash',
  'programming',
  'O\'zbekiston IT',
  'tech news',
  'kiberhavfsizlik',
  'startup',
  'machine learning',
  'web development',
];

/**
 * Extract keywords from content
 */
export function extractKeywords(content: string, tags?: string[]): string[] {
  const keywords = new Set<string>(tags || []);
  
  // Common tech keywords to look for
  const techTerms = [
    'AI', 'ML', 'API', 'React', 'Next.js', 'JavaScript', 'Python',
    'blockchain', 'crypto', 'startup', 'venture', 'cloud', 'AWS',
    'Google', 'Apple', 'Microsoft', 'OpenAI', 'ChatGPT', 'GPT',
    'mobile', 'iOS', 'Android', 'web', 'app', 'data', 'neural',
    'quantum', 'robotics', 'automation', 'DevOps', 'Kubernetes',
  ];
  
  const lowerContent = content.toLowerCase();
  
  for (const term of techTerms) {
    if (lowerContent.includes(term.toLowerCase())) {
      keywords.add(term);
    }
  }
  
  // Add Uzbek keywords
  keywords.add("texnologiya yangiliklari");
  keywords.add("IT O'zbekiston");
  
  return [...keywords].slice(0, 15); // Max 15 keywords
}

/**
 * Generate article metadata for Next.js
 */
export function generateArticleMetadata(article: {
  title: string;
  summary?: string | null;
  slug: string;
  imageUrl?: string | null;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}): Metadata {
  const url = `${BASE_URL}/uz/articles/${article.slug}`;
  const keywords = extractKeywords(article.title + ' ' + (article.summary || ''), article.tags);
  
  return {
    title: article.title,
    description: article.summary || DEFAULT_DESCRIPTION,
    keywords: [...keywords, ...DEFAULT_KEYWORDS.slice(0, 5)],
    
    // Open Graph
    openGraph: {
      title: article.title,
      description: article.summary || DEFAULT_DESCRIPTION,
      url,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      section: article.category || 'Technology',
      tags: keywords,
      locale: 'uz_UZ',
      alternateLocale: ['ru_RU', 'en_US'],
      images: article.imageUrl ? [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ] : [
        {
          url: `${BASE_URL}/og-default.png`,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary || DEFAULT_DESCRIPTION,
      images: article.imageUrl ? [article.imageUrl] : [`${BASE_URL}/og-default.png`],
    },
    
    // Canonical & Alternates
    alternates: {
      canonical: url,
      languages: {
        'uz-UZ': `${BASE_URL}/uz/articles/${article.slug}`,
        'ru-RU': `${BASE_URL}/ru/articles/${article.slug}`,
        'en-US': `${BASE_URL}/en/articles/${article.slug}`,
      },
    },
    
    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * JSON-LD Structured Data for Article (Schema.org)
 */
export function generateArticleJsonLd(article: {
  title: string;
  summary?: string | null;
  content: string;
  slug: string;
  imageUrl?: string | null;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  readingTime?: number | null;
  wordCount?: number | null;
  source?: string;
}): string {
  const url = `${BASE_URL}/uz/articles/${article.slug}`;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary || article.title,
    url,
    image: article.imageUrl || `${BASE_URL}/og-default.png`,
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: article.category || 'Technology',
    wordCount: article.wordCount || undefined,
    timeRequired: article.readingTime ? `PT${article.readingTime}M` : undefined,
    inLanguage: 'uz-UZ',
    isAccessibleForFree: true,
    // Breadcrumb
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: BASE_URL,
    },
  };

  return JSON.stringify(jsonLd);
}

/**
 * JSON-LD for Website (home page)
 */
export function generateWebsiteJsonLd(): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['uz-UZ', 'ru-RU', 'en-US'],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
  };

  return JSON.stringify(jsonLd);
}

/**
 * JSON-LD for Organization
 */
export function generateOrganizationJsonLd(): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      'https://t.me/antigravity_news', // Telegram channel
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Uzbek', 'Russian', 'English'],
    },
  };

  return JSON.stringify(jsonLd);
}

/**
 * Breadcrumb JSON-LD
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return JSON.stringify(jsonLd);
}
