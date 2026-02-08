/**
 * Image Extractor Utility (compat layer)
 *
 * This file is kept for backward compatibility and delegates
 * implementation to `meta-image.ts` to avoid duplicate logic.
 */

import { fetchMetaImage, getImageWithFallback } from './meta-image';

export { fetchMetaImage };

/**
 * Get image with fallback to meta extraction.
 */
export async function getArticleImage(
  apiImage: string | null | undefined,
  articleUrl: string
): Promise<string | undefined> {
  return getImageWithFallback(apiImage, articleUrl);
}
