export const articleFeedQueryKeys = {
  all: ['article-feed'] as const,
  list: (params: { pageSize: number; categoryId?: string; tagId?: string }) =>
    [...articleFeedQueryKeys.all, params] as const,
};
