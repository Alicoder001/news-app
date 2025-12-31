/**
 * @news-app/api-types
 * 
 * Shared API types for web and mobile apps
 */

// Article types
export type { 
  Difficulty, 
  Importance, 
  SourceType,
  Category, 
  Tag, 
  Article, 
  ArticleListItem,
  NewsSource 
} from './article';

// Response types
export type { 
  PaginationMeta,
  PaginatedResponse,
  ArticleListResponse,
  ArticleDetailResponse,
  CategoryListResponse,
  ApiError,
  ErrorResponse
} from './responses';
