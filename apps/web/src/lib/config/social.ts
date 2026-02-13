/**
 * Social Media & SEO Configuration
 * 
 * Central config for all social media profiles and sharing
 * 
 * @author Antigravity Team
 */

export const SITE_CONFIG = {
  name: 'Antigravity',
  tagline: "O'zbekiston IT Yangiliklar Portali",
  description: "Sun'iy intellekt yordamida tayyorlangan texnologiya yangiliklari",
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://news-app.uz',
  
  // Social Media Profiles
  social: {
    telegram: {
      channel: 'https://t.me/antigravity_news',
      bot: 'https://t.me/antigravity_bot',
      username: '@antigravity_news',
    },
    instagram: 'https://instagram.com/antigravity_uz',
    facebook: 'https://facebook.com/antigravity.uz',
    twitter: 'https://x.com/antigravity_uz',
    linkedin: 'https://linkedin.com/company/antigravity-uz',
    youtube: 'https://youtube.com/@antigravity_uz',
    github: 'https://github.com/antigravity-uz',
  },
  
  // Default OG Image
  defaultImage: '/og-default.png',
  
  // Contact
  email: 'info@antigravity.uz',
  
  // SEO
  keywords: [
    'IT yangiliklar',
    'texnologiya',
    "sun'iy intellekt",
    'AI',
    'dasturlash',
    'programming',
    "O'zbekiston IT",
    'tech news',
    'kiberhavfsizlik',
    'startup',
  ],

  // Feature Toggles
  features: {
    ads: false,
  },
} as const;

/**
 * Generate share URLs for different platforms
 */
export function getShareUrls(articleUrl: string, title: string, summary?: string) {
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary || title);
  const hashtags = 'IT,Texnologiya,Antigravity';
  
  return {
    // Telegram - Most important for Uzbek audience
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    
    // Twitter/X
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtags}&via=antigravity_uz`,
    
    // Facebook
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    
    // LinkedIn
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    
    // WhatsApp
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    
    // Copy link (handled in component)
    copyLink: articleUrl,
    
    // Email
    email: `mailto:?subject=${encodedTitle}&body=${encodedSummary}%0A%0A${encodedUrl}`,
  };
}

/**
 * Get platform-specific meta tags
 */
export function getSocialMetaTags(article: {
  title: string;
  summary?: string;
  url: string;
  imageUrl?: string;
  publishedAt?: string;
  author?: string;
}) {
  const image = article.imageUrl || `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`;
  
  return {
    // Basic OG
    'og:type': 'article',
    'og:site_name': SITE_CONFIG.name,
    'og:title': article.title,
    'og:description': article.summary || SITE_CONFIG.description,
    'og:url': article.url,
    'og:image': image,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:locale': 'uz_UZ',
    'og:locale:alternate': ['ru_RU', 'en_US'],
    
    // Twitter Card
    'twitter:card': 'summary_large_image',
    'twitter:site': '@antigravity_uz',
    'twitter:creator': '@antigravity_uz',
    'twitter:title': article.title,
    'twitter:description': article.summary || SITE_CONFIG.description,
    'twitter:image': image,
    'twitter:image:alt': article.title,
    
    // Article specific
    'article:published_time': article.publishedAt,
    'article:author': article.author || SITE_CONFIG.name,
    'article:section': 'Technology',
    'article:tag': SITE_CONFIG.keywords.join(', '),
    
    // Telegram
    'telegram:channel': SITE_CONFIG.social.telegram.username,
  };
}
