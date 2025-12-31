/**
 * React Query Hooks
 *
 * Data fetching hooks using TanStack Query
 *
 * @package @news-app/mobile
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../api/client';

/**
 * Fetch paginated articles list
 */
export function useArticles(categorySlug?: string) {
  return useInfiniteQuery({
    queryKey: ['articles', categorySlug],
    queryFn: ({ pageParam = 1 }) => api.articles.list(pageParam, 10, categorySlug),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + page.articles.length, 0);
      if (totalFetched < lastPage.total) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

/**
 * Fetch single article by slug
 */
export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => api.articles.getBySlug(slug),
    enabled: !!slug,
  });
}

/**
 * Fetch featured articles
 */
export function useFeaturedArticles(limit = 5) {
  return useQuery({
    queryKey: ['articles', 'featured', limit],
    queryFn: () => api.articles.getFeatured(limit),
  });
}

/**
 * Fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.list,
  });
}
