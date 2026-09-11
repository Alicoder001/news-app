import Link from 'next/link';
import { CategoryBadge } from './badges';
import type { CardArticle } from './article-card';

function formatHeroDate(value: Date | string | null): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('uz-UZ');
}

/**
 * Hero section ported from legacy/apps/web hero-carousel design.
 * Static (no carousel dependency): featured story + secondary headlines.
 * URLs stay identical: /articles/<slug>.
 */
export function HeroSection({ articles }: { articles: CardArticle[] }) {
  if (articles.length === 0) return null;
  const [featured, ...rest] = articles;
  const secondary = rest.slice(0, 2);

  return (
    <section className="relative group/carousel">
      <article className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pb-8 border-b border-border">
        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-gradient-to-br from-cyan-500/25 via-blue-500/10 to-indigo-500/25 flex items-center justify-center">
          <span className="text-7xl font-serif font-black text-foreground/10 select-none">
            {featured.category.slice(0, 1).toUpperCase()}
          </span>
          <div className="absolute inset-0 neon-grid opacity-30" />
        </div>

        <div className="space-y-4 glass-card p-6 md:p-8 rounded-2xl h-full flex flex-col justify-center">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
            <CategoryBadge category={featured.category} />
            <span className="w-0.5 h-0.5 rounded-full bg-foreground/20" />
            <span>{formatHeroDate(featured.websitePublishedAt)}</span>
          </div>

          <Link href={`/articles/${featured.slug}`} className="block transition-opacity space-y-3">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold leading-tight tracking-tight text-foreground">
              {featured.title}
            </h2>
            {featured.shortSummary && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{featured.shortSummary}</p>
            )}
          </Link>

          <div className="flex items-center gap-3 pt-2 border-t border-foreground/5">
            <span className="text-[11px] text-muted-foreground font-medium">ai_shunos Team</span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-[11px] text-muted-foreground">{featured.readingTime ?? 5} min read</span>
          </div>
        </div>
      </article>

      {secondary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {secondary.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="glass-card rounded-2xl p-5 block hover:no-underline"
            >
              <div className="text-[11px] font-bold uppercase tracking-widest text-accent mb-2">{article.category}</div>
              <h3 className="font-serif font-bold leading-snug line-clamp-2">{article.title}</h3>
              {article.shortSummary && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{article.shortSummary}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
