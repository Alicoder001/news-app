/**
 * Image Extractor Utility
 * 
 * Maqola uchun rasm olish:
 * 1. Avval API'dan kelgan image ishlatiladi
 * 2. Agar yo'q bo'lsa, URL'dan og:image meta tag olinadi
 */

import * as cheerio from 'cheerio';

/**
 * Fetch og:image from URL meta tags
 */
export async function fetchMetaImage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AishunosBot/1.0)',
      },
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      return null;
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Try different meta image tags
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) return ogImage;
    
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    if (twitterImage) return twitterImage;
    
    const metaImage = $('meta[itemprop="image"]').attr('content');
    if (metaImage) return metaImage;
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Get image with fallback to meta extraction
 */
export async function getArticleImage(
  apiImage: string | null | undefined,
  articleUrl: string
): Promise<string | undefined> {
  // 1. Use API image if available
  if (apiImage) {
    return apiImage;
  }
  
  // 2. Try to fetch from meta tags
  const metaImage = await fetchMetaImage(articleUrl);
  return metaImage || undefined;
}
