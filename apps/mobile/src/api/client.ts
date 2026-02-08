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

interface LegacyPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface NewPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface LegacyArticlesResponse {
  articles: ArticleListItem[];
  pagination: LegacyPagination;
}

interface NewArticlesResponse {
  data: ArticleListItem[];
  pagination: NewPagination;
}

interface ArticleDetailResponse {
  data: Article;
}

interface ListResponse<T> {
  data: T[];
}

export interface MobileArticlesPage {
  articles: ArticleListItem[];
  total: number;
  hasNextPage: boolean;
}

function isLegacyResponse(payload: unknown): payload is LegacyArticlesResponse {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'articles' in payload &&
    Array.isArray((payload as LegacyArticlesResponse).articles)
  );
}

function isNewResponse(payload: unknown): payload is NewArticlesResponse {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    Array.isArray((payload as NewArticlesResponse).data)
  );
}

function normalizeArticlesResponse(payload: unknown): MobileArticlesPage {
  if (isLegacyResponse(payload)) {
    return {
      articles: payload.articles,
      total: payload.pagination.total,
      hasNextPage: payload.pagination.hasNextPage,
    };
  }

  if (isNewResponse(payload)) {
    return {
      articles: payload.data,
      total: payload.pagination.total,
      hasNextPage: payload.pagination.hasNext,
    };
  }

  throw new Error('API contract mismatch: articles list response formati noto\'g\'ri');
}

function normalizeArticleDetailResponse(payload: unknown): Article {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    typeof (payload as ArticleDetailResponse).data === 'object' &&
    (payload as ArticleDetailResponse).data !== null
  ) {
    return (payload as ArticleDetailResponse).data;
  }

  if (typeof payload === 'object' && payload !== null && 'id' in payload) {
    return payload as Article;
  }

  throw new Error('API contract mismatch: article detail response formati noto\'g\'ri');
}

function normalizeListResponse<T>(payload: unknown): T[] {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    Array.isArray((payload as ListResponse<T>).data)
  ) {
    return (payload as ListResponse<T>).data;
  }

  if (Array.isArray(payload)) {
    return payload as T[];
  }

  throw new Error('API contract mismatch: list response formati noto\'g\'ri');
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
    ): Promise<MobileArticlesPage> => {
      let url = `/api/articles?page=${page}&limit=${limit}`;
      if (categorySlug) {
        url += `&category=${categorySlug}`;
      }
      const response = await fetchApi<unknown>(url);
      return normalizeArticlesResponse(response);
    },

    /**
     * Get single article by slug
     */
    getBySlug: async (slug: string): Promise<Article> => {
      const response = await fetchApi<unknown>(`/api/articles/${slug}`);
      return normalizeArticleDetailResponse(response);
    },

    /**
     * Get featured/hero articles
     */
    getFeatured: async (limit = 5): Promise<ArticleListItem[]> => {
      const response = await fetchApi<unknown>(`/api/articles/featured?limit=${limit}`);
      return normalizeListResponse<ArticleListItem>(response);
    },
  },

  categories: {
    /**
     * Get all categories
     */
    list: async (): Promise<Category[]> => {
      const response = await fetchApi<unknown>('/api/categories');
      return normalizeListResponse<Category>(response);
    },
  },
};

export default api;
