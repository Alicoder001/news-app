import type { Article, ArticleListItem, Category } from './article';

export interface CanonicalSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface CanonicalError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type CanonicalResponse<T> = CanonicalSuccess<T> | CanonicalError;

export interface CanonicalPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CanonicalArticleListPayload {
  articles: ArticleListItem[];
  pagination: CanonicalPagination;
}

export interface CanonicalArticleDetailPayload {
  article: Article;
}

export interface CanonicalFeaturedPayload {
  articles: ArticleListItem[];
}

export interface CanonicalCategoriesPayload {
  categories: Category[];
}
