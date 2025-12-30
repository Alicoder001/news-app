import prisma from '@/lib/prisma';
import Link from 'next/link';
import { CategoryBadge } from '@/components/category-badge';
import { Tag } from '@/components/tag';
import { ImportanceBadge, DifficultyBadge } from '@/components/badges';
import { CategorySidebar } from '@/components/category-sidebar';
import { TrendingSection } from '@/components/trending-section';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { ThemeToggle } from '@/components/theme-toggle';

async function getArticles() {
  return await prisma.article.findMany({
    include: {
      category: true,
      tags: true,
      rawArticle: { include: { source: true } }
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function getFeaturedArticle() {
  return await prisma.article.findFirst({
    where: {
      importance: 'CRITICAL',
    },
    include: {
      category: true,
      tags: true,
      rawArticle: { include: { source: true } }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function HomePage() {
  const [allArticles, featuredArticle] = await Promise.all([
    getArticles(),
    getFeaturedArticle(),
  ]);

  const regularArticles = featuredArticle 
    ? allArticles.filter(a => a.id !== featuredArticle.id)
    : allArticles;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Hero Header */}
      <header className="mb-20 flex justify-between items-start gap-8">
        <div className="max-w-3xl">
          <h1 className="text-6xl font-serif italic mb-6 tracking-tighter text-foreground">Antigravity News</h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            Axborot shovqinidan tashqari. Biz sizga dunyoni tushunish uchun kerak bo'lgan kontekst va chuqur tahlilni yetkazamiz.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Feed */}
        <main className="lg:col-span-8 space-y-20">
          
          {/* Featured Article */}
          {featuredArticle && (
            <section>
              <Link href={`/article/${featuredArticle.slug}`} className="group block">
                <article className="glass-card relative overflow-hidden rounded-[1.5rem] p-8 lg:p-12">
                  <div className="space-y-6">
                    {/* Featured Badge */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-foreground/10 text-foreground/60 bg-foreground/[0.02]">
                        Featured
                      </span>
                      {featuredArticle.category && (
                        <CategoryBadge category={featuredArticle.category} size="md" />
                      )}
                      <ImportanceBadge importance={featuredArticle.importance} />
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-serif font-medium leading-[1.2] tracking-tight group-hover:text-foreground/80 transition-colors">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-lg text-muted-foreground line-clamp-3 leading-relaxed max-w-2xl">
                      {featuredArticle.summary}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 flex-wrap text-xs font-medium uppercase tracking-wider text-muted-foreground/80 pt-2">
                      <span className="font-bold text-foreground/80">{featuredArticle.rawArticle.source.name}</span>
                      <span className="w-1 h-1 rounded-full bg-foreground/20"></span>
                      <span>{new Date(featuredArticle.createdAt).toLocaleDateString('uz-UZ')}</span>
                      {featuredArticle.readingTime && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-foreground/20"></span>
                          <span>{featuredArticle.readingTime} min read</span>
                        </>
                      )}
                    </div>


                    {/* Tags */}
                    {featuredArticle.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap pt-4">
                        {featuredArticle.tags.slice(0, 4).map(tag => (
                          <Tag key={tag.id} tag={tag} size="sm" />
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            </section>
          )}

          {/* Regular Articles Feed */}
          <section className="space-y-12">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/30 border-b border-foreground/5 pb-4">
              So'nggi Maqolalar
            </h2>
            
            <div className="space-y-16">
              {regularArticles.map((article) => (
                <article key={article.id} className="group">
                  <Link href={`/article/${article.slug}`} className="block space-y-4">
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-foreground/30">
                      {article.category && (
                        <span style={{ color: article.category.color || 'inherit' }}>
                          {article.category.name}
                        </span>
                      )}
                      <span className="opacity-20">•</span>
                      <span>{new Date(article.createdAt).toLocaleDateString('uz-UZ')}</span>
                      {article.readingTime && (
                        <>
                          <span className="opacity-20">•</span>
                          <span>{article.readingTime} min</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-2xl font-medium leading-tight group-hover:text-foreground/80 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-foreground/50 line-clamp-2 text-sm leading-relaxed max-w-2xl font-light">
                      {article.summary}
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                       <ImportanceBadge importance={article.importance} />
                       <DifficultyBadge difficulty={article.difficulty} />
                       {article.tags.length > 0 && (
                        <div className="flex gap-2">
                          {article.tags.slice(0, 2).map(tag => (
                            <span key={tag.id} className="text-[10px] text-foreground/20 italic">
                              #{tag.slug}
                            </span>
                          ))}
                        </div>
                       )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>

        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-16">
          <TrendingSection />
          <CategorySidebar />
          <NewsletterSignup />
        </aside>
      </div>

      {/* Footer */}
      <footer className="mt-24 pt-12 border-t border-foreground/[0.05] text-center">
        <p className="text-xs text-foreground/30 uppercase tracking-[0.2em] font-medium">
          &copy; {new Date().getFullYear()} Antigravity. Barcha huquqlar himoyalangan.
        </p>
      </footer>
    </div>
  );
}
