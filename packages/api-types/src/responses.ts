/**
 * API Response Types
 * 
 * Standard response structures for REST API endpoints
 * 
 * @package @news-app/api-types
 */

import type { Article, ArticleListItem, Category } from './article';

// ============================================
// PAGINATION
// ============================================

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ============================================
// ARTICLE RESPONSES
// ============================================

/**
 * Article list response (paginated)
 */
export interface ArticleListResponse extends PaginatedResponse<ArticleListItem> {}

/**
 * Article detail response with related articles
 */
export interface ArticleDetailResponse {
  data: Article;
  related: ArticleListItem[];
}

// ============================================
// CATEGORY RESPONSES
// ============================================

/**
 * Category list response
 */
export interface CategoryListResponse {
  data: Category[];
}

// ============================================
// ERROR RESPONSES
// ============================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ErrorResponse {
  error: ApiError;
}
