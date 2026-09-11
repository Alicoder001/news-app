import Link from 'next/link';
import { listPublishedArticles } from '@/lib/content/article.service';
import { prisma } from '@/lib/db/prisma';
import { CategoryNav } from '@/components/category-nav';
import { HeroSection } from '@/components/hero-section';
import { ArticleCard, estimateReadingTime } from '@/components/article-card';

export default async function HomePage() {
  const [latestArticles, categories] = await Promise.all([
    listPublishedArticles(12),
    prisma.article.groupBy({
      by: ['category'],
      where: { websitePublished: true },
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
    }),
  ]);

  const withReadingTime = latestArticles.map((article) => ({
    ...article,
    readingTime: estimateReadingTime(article.fullArticle),
  }));

  const featured = withReadingTime.slice(0, 3);
  const featuredIds = new Set(featured.map((a) => a.id));
  const regular = withReadingTime.filter((a) => !featuredIds.has(a.id));

  return (
    <div className="space-y-1">
      <h1 className="sr-only">ai_shunos — AI news, verified. IT Yangiliklar, Sun&apos;iy Intellekt, Dasturlash, Texnologiya</h1>

      <CategoryNav categories={categories.map((c) => ({ name: c.category, count: c._count.category }))} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <main className="lg:col-span-9 space-y-4">
          {featured.length > 0 && <HeroSection articles={featured} />}

          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-foreground/5 pb-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/70">
                <span className="sr-only">IT Yangiliklar va Texnologiya Tahlillari — </span>
                Latest verified stories
              </h2>
              <Link href="/articles" className="text-xs font-bold uppercase tracking-widest text-accent hover:underline">
                Browse all
              </Link>
            </div>

            {regular.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7">
                {regular.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No published articles yet.</p>
            )}
          </section>
        </main>

        <aside className="lg:col-span-3 self-start sticky top-24 space-y-6">
          <section className="glass-card p-4 rounded-2xl">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70 mb-4">
              Popular categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.category}
                  href={'/categories/' + encodeURIComponent(category.category)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-foreground/5 border border-foreground/10 text-foreground/70 hover:text-foreground hover:border-foreground/20 transition-colors"
                >
                  {category.category}
                  <span className="text-foreground/40">({category._count.category})</span>
                </Link>
              ))}
              {categories.length === 0 && (
                <p className="text-xs text-muted-foreground">No categories yet.</p>
              )}
            </div>
          </section>

          <section className="glass-card p-5 rounded-2xl space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70">About ai_shunos</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Har bir maqola RSS orqali yig&apos;iladi, kamida 2 manba bilan solishtiriladi va website-first
              publish oqimi bilan chiqariladi.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href="/articles"
                className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-foreground text-background hover:opacity-85 transition-opacity"
              >
                Latest articles
              </Link>
              <Link
                href="/tg"
                className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors"
              >
                Mini App view
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
