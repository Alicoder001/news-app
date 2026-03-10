import type { ArticleFeedPage } from '@/entities/article/model/types';

export interface FetchArticlesInput {
  page: number;
  limit: number;
  categoryId?: string;
  tagId?: string;
}

export async function fetchArticlesPage({
  page,
  limit,
  categoryId,
  tagId,
}: FetchArticlesInput): Promise<ArticleFeedPage> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (categoryId) {
    params.set('category', categoryId);
  }
  if (tagId) {
    params.set('tag', tagId);
  }

  const response = await fetch(`/api/articles?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.status}`);
  }

  return (await response.json()) as ArticleFeedPage;
}
