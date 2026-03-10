import type { Difficulty, Importance } from '@news-app/api-types';

export interface ArticleCategory {
  id: string;
  slug: string;
  name: string;
  color?: string | null;
}

export interface ArticleFeedItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  imageUrl: string | null;
  category: ArticleCategory | null;
  readingTime: number | null;
  difficulty: Difficulty;
  importance: Importance;
  viewCount: number;
  createdAt: string;
}

export interface ArticleFeedPage {
  articles: ArticleFeedItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
