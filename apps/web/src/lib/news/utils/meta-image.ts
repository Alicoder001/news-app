/**
 * Meta Image Fetcher Utility
 * 
 * Fetches og:image or twitter:image from a URL's HTML meta tags.
 * Used as fallback when news API doesn't provide image.
 * 
 * @author Aishunos Team
 * @version 1.0.0
 */

/**
 * Fetch meta image from a URL
 * Tries og:image first, then twitter:image
 * 
 * @param url - The article URL to fetch meta image from
 * @returns Image URL or undefined if not found
 */
export async function fetchMetaImage(url: string): Promise<string | undefined> {
  try {
    // Fetch with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AishunosBot/1.0)',
      },
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      return undefined;
    }
    
    const html = await response.text();
    
    // Try og:image first
    const ogImage = extractMetaContent(html, 'og:image');
    if (ogImage) return ogImage;
    
    // Try twitter:image
    const twitterImage = extractMetaContent(html, 'twitter:image');
    if (twitterImage) return twitterImage;
    
    // Try standard image meta
    const metaImage = extractMetaContent(html, 'image');
    if (metaImage) return metaImage;
    
    return undefined;
  } catch (error) {
    console.warn(`Failed to fetch meta image from ${url}:`, error);
    return undefined;
  }
}

/**
 * Extract meta content from HTML
 */
function extractMetaContent(html: string, property: string): string | undefined {
  // Match property="og:image" or name="og:image" patterns
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, 'i'),
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  
  return undefined;
}

/**
 * Get image URL with fallback
 * First checks provided imageUrl, then fetches from meta if needed
 * 
 * @param imageUrl - Image URL from API (may be null/undefined)
 * @param articleUrl - Original article URL for fallback
 * @returns Image URL or undefined
 */
export async function getImageWithFallback(
  imageUrl: string | null | undefined,
  articleUrl: string
): Promise<string | undefined> {
  // If API provided image, use it
  if (imageUrl) {
    return imageUrl;
  }
  
  // Fallback: fetch from article meta tags
  console.log(`📷 No image from API, fetching meta from: ${articleUrl}`);
  return fetchMetaImage(articleUrl);
}
