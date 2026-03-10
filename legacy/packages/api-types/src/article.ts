/**
 * Article Types
 * 
 * Shared article, category, and tag types for web and mobile apps
 * Independent from Prisma client for cross-platform usage
 * 
 * @package @news-app/api-types
 */

// ============================================
// ENUMS
// ============================================

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type Importance = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SourceType = 'NEWS_API' | 'RSS' | 'SCRAPER';

// ============================================
// CORE ENTITIES
// ============================================

/**
 * Category entity
 */
export interface Category {
  id: string;
  slug: string;
  name: string;
  nameEn?: string | null;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
}

/**
 * Tag entity
 */
export interface Tag {
  id: string;
  name: string;
  slug: string;
}

/**
 * Article entity (for API responses)
 */
export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string;
  imageUrl: string | null;
  originalUrl: string;
  
  // Relations
  category: Category | null;
  tags: Tag[];
  
  // Content Metadata
  readingTime: number | null;
  wordCount: number | null;
  difficulty: Difficulty;
  importance: Importance;
  
  // Engagement Metrics
  viewCount: number;
  shareCount: number;
  
  // Telegram
  telegramPosted: boolean;
  telegramPostId: string | null;
  
  // Meta
  language: string;
  createdAt: string; // ISO date string for JSON serialization
  updatedAt: string;
}

/**
 * Article list item (minimal data for lists)
 */
export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  imageUrl: string | null;
  category: Pick<Category, 'id' | 'slug' | 'name' | 'icon' | 'color'> | null;
  readingTime: number | null;
  difficulty: Difficulty;
  importance: Importance;
  viewCount: number;
  createdAt: string;
}

/**
 * News source entity
 */
export interface NewsSource {
  id: string;
  name: string;
  url: string;
  type: SourceType;
  isActive: boolean;
  lastFetched: string | null;
}
