import Link from 'next/link';
import { CategoryBadge, TagBadge } from './badges';

export interface CardArticle {
  id: string;
  slug: string;
  title: string;
  shortSummary: string | null;
  category: string;
  tags: string[];
  websitePublishedAt: Date | string | null;
  readingTime?: number | null;
}

export function estimateReadingTime(fullArticle?: string | null): number {
  if (!fullArticle) return 4;
  const words = fullArticle.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatCardDate(value: Date | string | null): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' });
}

/**
 * Article card ported from legacy/apps/web features/article-feed card design.
 * Adapted to current DTO: string category/tags, no imageUrl.
 */
export function ArticleCard({ article }: { article: CardArticle }) {
  return (
    <article className="group flex flex-col gap-3 glass-card p-3 h-full rounded-2xl">
      <div className="relative aspect-[16/10] w-full rounded-sm overflow-hidden bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-indigo-500/20 flex items-center justify-center">
        <span className="text-4xl font-serif font-black text-foreground/15 select-none">
          {article.category.slice(0, 1).toUpperCase()}
        </span>
        <div className="absolute top-2 left-2">
          <CategoryBadge category={article.category} />
        </div>
      </div>

      <div className="space-y-1.5 flex flex-col flex-1">
        <div className="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider text-muted-foreground/70">
          <span className="text-accent brightness-90">{article.category}</span>
          <span>{formatCardDate(article.websitePublishedAt)}</span>
        </div>

        <Link href={`/articles/${article.slug}`} className="block space-y-1">
          <h3 className="text-base font-serif font-bold leading-tight group-hover:text-foreground/70 transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.shortSummary && (
            <p className="text-sm text-muted-foreground leading-snug line-clamp-2">{article.shortSummary}</p>
          )}
        </Link>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {article.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-foreground/5 mt-auto">
          <span className="text-[11px] text-muted-foreground">{article.readingTime ?? 4} min read</span>
        </div>
      </div>
    </article>
  );
}
