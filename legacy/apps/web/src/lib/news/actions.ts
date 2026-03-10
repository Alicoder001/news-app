'use server';

import { getArticles } from '@/lib/api/server-api';
import type { Difficulty, Importance } from '@news-app/api-types';

export interface ArticleWithRelations {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content?: string;
  imageUrl: string | null;
  category: {
    id: string;
    slug: string;
    name: string;
    color?: string | null;
  } | null;
  tags: Array<{ id: string; name: string; slug: string }>;
  rawArticle?: {
    source?: {
      id: string;
      name: string;
      url?: string;
    } | null;
    publishedAt?: string | null;
  } | null;
  readingTime: number | null;
  difficulty: Difficulty;
  importance: Importance;
  viewCount: number;
  createdAt: string;
}

export async function fetchArticlesAction(
  page: number = 1,
  pageSize: number = 12,
  categoryId?: string,
  tagId?: string
) {
  try {
    const response = await getArticles({
      page,
      limit: pageSize,
      includeRawSource: true,
    });
    const data = response.data as {
      articles?: ArticleWithRelations[];
      pagination?: { totalPages?: number };
    };

    return {
      articles: data.articles ?? [],
      totalPages: data.pagination?.totalPages ?? 0,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      articles: [],
      totalPages: 0,
      currentPage: page,
      error: 'Failed to fetch articles'
    };
  }
}
