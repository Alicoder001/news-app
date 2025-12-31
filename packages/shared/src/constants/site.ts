/**
 * Site Configuration
 * 
 * Central config for branding, social media profiles
 * 
 * @package @news-app/shared
 */

export const SITE_CONFIG = {
  name: 'Antigravity',
  tagline: "O'zbekiston IT Yangiliklar Portali",
  description: "Sun'iy intellekt yordamida tayyorlangan texnologiya yangiliklari",
  
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
  
  // SEO Keywords
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

export type SiteConfig = typeof SITE_CONFIG;
export type ShareUrls = ReturnType<typeof getShareUrls>;
