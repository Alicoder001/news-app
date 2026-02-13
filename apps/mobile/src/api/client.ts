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
  CanonicalResponse,
} from '@news-app/api-types';
import { Platform } from 'react-native';

// API base URL - use environment variable or default
// For web, localhost:3000 is usually the right default for dev
// For mobile, we need the local IP address
const API_BASE =
  process.env.EXPO_PUBLIC_API_URL || 
  (Platform.OS === 'web' ? 'http://localhost:4000' : 'http://192.168.1.100:4000');

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
      let url = `/v1/articles?page=${page}&limit=${limit}`;
      if (categorySlug) {
        url += `&category=${categorySlug}`;
      }
      const response = await fetchApi<CanonicalResponse<{
        articles: ArticleListItem[];
        pagination: { total: number };
      }>>(url);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return {
        articles: response.data.articles ?? [],
        total: response.data.pagination?.total ?? 0,
      };
    },

    /**
     * Get single article by slug
     */
    getBySlug: async (slug: string): Promise<Article> => {
      const response = await fetchApi<CanonicalResponse<{ article: Article }>>(`/v1/articles/${slug}`);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data.article;
    },

    /**
     * Get featured/hero articles
     */
    getFeatured: async (limit = 5): Promise<ArticleListItem[]> => {
      const response = await fetchApi<CanonicalResponse<{ articles: ArticleListItem[] }>>(
        `/v1/articles/featured?limit=${limit}`,
      );
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data.articles ?? [];
    },
  },

  categories: {
    /**
     * Get all categories
     */
    list: async (): Promise<Category[]> => {
      const response = await fetchApi<CanonicalResponse<{ categories: Category[] }>>('/v1/categories');
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data.categories ?? [];
    },
  },
};

export default api;
