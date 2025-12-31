/**
 * API Client
 *
 * REST API client for fetching articles and categories
 *
 * @package @news-app/mobile
 */

import type {
  Article,
  ArticleListItem,
  Category,
  PaginatedResponse,
} from '@news-app/api-types';
import { Platform } from 'react-native';

// API base URL - use environment variable or default
// For web, localhost:3000 is usually the right default for dev
// For mobile, we need the local IP address
const API_BASE =
  process.env.EXPO_PUBLIC_API_URL || 
  (Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.1.100:3000');

/**
 * Fetch wrapper with error handling
 */
async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`);

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * API methods for articles, categories
 */
export const api = {
  articles: {
    /**
     * Get paginated list of articles
     */
    list: async (
      page = 1,
      limit = 10,
      categorySlug?: string
    ): Promise<{ articles: ArticleListItem[]; total: number }> => {
      let url = `/api/articles?page=${page}&limit=${limit}`;
      if (categorySlug) {
        url += `&category=${categorySlug}`;
      }
      return fetchApi(url);
    },

    /**
     * Get single article by slug
     */
    getBySlug: async (slug: string): Promise<Article> => {
      return fetchApi(`/api/articles/${slug}`);
    },

    /**
     * Get featured/hero articles
     */
    getFeatured: async (limit = 5): Promise<ArticleListItem[]> => {
      return fetchApi(`/api/articles/featured?limit=${limit}`);
    },
  },

  categories: {
    /**
     * Get all categories
     */
    list: async (): Promise<Category[]> => {
      return fetchApi('/api/categories');
    },
  },
};

export default api;
