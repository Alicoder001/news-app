'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { DifficultyBadge } from '@/components/badges';
import { ArticleWithRelations, fetchArticlesAction } from '@/lib/news/actions';

interface InfiniteArticleListProps {
  initialArticles: ArticleWithRelations[];
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
  tagId
}: InfiniteArticleListProps) {
  const [articles, setArticles] = useState<ArticleWithRelations[]>(initialArticles);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPage < totalPages);

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  const loadMoreArticles = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;
    
    const result = await fetchArticlesAction(nextPage, pageSize, categoryId, tagId);
    
    if (result.articles.length > 0) {
      setArticles((prev) => [...prev, ...result.articles]);
      setPage(nextPage);
      setHasMore(nextPage < result.totalPages);
    } else {
      setHasMore(false);
    }
    
    setLoading(false);
  }, [page, loading, hasMore, pageSize, categoryId, tagId]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadMoreArticles();
    }
  }, [inView, hasMore, loading, loadMoreArticles]);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {articles.map((article) => (
          <article key={article.id} className="group flex flex-col gap-3">
            {/* Thumbnail */}
            <div className="relative aspect-[3/2] w-full rounded-lg overflow-hidden bg-muted">
              {article.imageUrl && (
                <Image 
                  src={article.imageUrl} 
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">
                {article.category && (
                  <span style={{ color: article.category.color || 'inherit' }} className="brightness-90">
                    {article.category.name}
                  </span>
                )}
                <span>{new Date(article.createdAt).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })}</span>
              </div>

              <Link href={`/articles/${article.slug}`} className="block space-y-1.5">
                <h3 className="text-base font-serif font-bold leading-snug group-hover:text-foreground/70 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                {article.summary && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {article.summary}
                  </p>
                )}
              </Link>
              
              <div className="flex items-center gap-2 pt-1 border-t border-foreground/5 mt-2">
                <span className="text-[10px] text-muted-foreground">{article.readingTime || 4} min</span>
                <DifficultyBadge difficulty={article.difficulty} />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Loading Indicator / Observer Target */}
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
