'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchArticlesPage } from '@/entities/article/api/articles.api';
import type { ArticleFeedPage } from '@/entities/article/model/types';
import { articleFeedQueryKeys } from './query-keys';

interface UseInfiniteArticlesQueryInput {
  initialPage: number;
  initialData: ArticleFeedPage;
  pageSize: number;
  categoryId?: string;
  tagId?: string;
}

export function useInfiniteArticlesQuery({
  initialPage,
  initialData,
  pageSize,
  categoryId,
  tagId,
}: UseInfiniteArticlesQueryInput) {
  return useInfiniteQuery({
    queryKey: articleFeedQueryKeys.list({ pageSize, categoryId, tagId }),
    queryFn: ({ pageParam }) =>
      fetchArticlesPage({
        page: pageParam,
        limit: pageSize,
        categoryId,
        tagId,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: initialPage,
    initialData: {
      pages: [initialData],
      pageParams: [initialPage],
    },
  });
}
