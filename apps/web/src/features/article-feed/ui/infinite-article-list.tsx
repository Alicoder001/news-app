'use client';

import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import { DifficultyBadge } from '@/components/badges';
import { SITE_CONFIG } from '@/lib/config/social';
import { AdBanner } from '@/components/ad-banner';
import type { ArticleFeedItem } from '@/entities/article/model/types';
import { useInfiniteArticlesQuery } from '@/features/article-feed/model/use-infinite-articles-query';
import { useArticleFeedStore } from '@/features/article-feed/model/feed.store';

interface InfiniteArticleListProps {
  initialArticles: ArticleFeedItem[];
  initialPage: number;
  totalPages: number;
  pageSize?: number;
  categoryId?: string;
  tagId?: string;
}

export function InfiniteArticleList({
  initialArticles,
  initialPage,
  totalPages,
  pageSize = 12,
  categoryId,
  tagId,
}: InfiniteArticleListProps) {
  const { pageSize: storePageSize, setPageSize, autoLoad } = useArticleFeedStore((state) => ({
    pageSize: state.pageSize,
    setPageSize: state.setPageSize,
    autoLoad: state.autoLoad,
  }));

  useEffect(() => {
    if (storePageSize !== pageSize) {
      setPageSize(pageSize);
    }
  }, [pageSize, setPageSize, storePageSize]);

  const query = useInfiniteArticlesQuery({
    initialPage,
    pageSize: storePageSize,
    categoryId,
    tagId,
    initialData: {
      articles: initialArticles,
      pagination: {
        page: initialPage,
        limit: storePageSize,
        total: totalPages * storePageSize,
        totalPages,
        hasNextPage: initialPage < totalPages,
        hasPrevPage: initialPage > 1,
      },
    },
  });

  const articles = useMemo(
    () => query.data?.pages.flatMap((page) => page.articles) ?? initialArticles,
    [initialArticles, query.data],
  );

  const hasMore = query.hasNextPage;
  const loading = query.isFetchingNextPage;

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasMore && !loading && autoLoad) {
      void query.fetchNextPage();
    }
  }, [autoLoad, hasMore, inView, loading, query]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-7">
        {articles.map((article, index) => (
          <Fragment key={article.id}>
            <article className="group flex flex-col gap-3 glass-card p-3 h-full">
              <div className="relative aspect-[16/10] w-full rounded-sm overflow-hidden">
                {article.imageUrl && (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider text-muted-foreground/70">
                  {article.category && (
                    <span style={{ color: article.category.color || 'inherit' }} className="brightness-90">
                      {article.category.name}
                    </span>
                  )}
                  <span>{new Date(article.createdAt).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })}</span>
                </div>

                <Link href={`/articles/${article.slug}`} className="block space-y-1">
                  <h3 className="text-base font-serif font-bold leading-tight group-hover:text-foreground/70 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p className="text-sm text-muted-foreground leading-snug line-clamp-2">{article.summary}</p>
                  )}
                </Link>

                <div className="flex items-center gap-2 pt-2 border-t border-foreground/5 mt-auto">
                  <span className="text-[11px] text-muted-foreground">{article.readingTime || 4} min</span>
                  <DifficultyBadge difficulty={article.difficulty} />
                </div>
              </div>
            </article>

            {(index + 1) % 8 === 0 && SITE_CONFIG.features.ads && (
              <div className="col-span-full py-6 border-y border-white/5 my-4">
                <AdBanner slot={`in-feed-${index}`} format="leaderboard" className="mx-auto" />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <div ref={ref} className="flex justify-center py-8">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Yuklanmoqda...
          </div>
        )}
        {!hasMore && articles.length > 0 && (
          <p className="text-xs text-muted-foreground/50 uppercase tracking-widest font-bold">
            Barcha maqolalar yuklandi
          </p>
        )}
      </div>
    </div>
  );
}
