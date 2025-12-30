import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryBadge } from '@/components/category-badge';
import { Tag } from '@/components/tag';
import { ImportanceBadge, DifficultyBadge } from '@/components/badges';
import { CategoryNav } from '@/components/category-nav';
import { TrendingSection } from '@/components/trending-section';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { AboutWidget } from '@/components/about-widget';

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
    <div className="space-y-8">
      <CategoryNav />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-9 space-y-10">
          
          {/* COMPACT HERO SECTION */}
          {featuredArticle && (
            <article className="group relative grid grid-cols-1 md:grid-cols-2 gap-6 items-start border-b border-border pb-8">
               <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-muted">
                  {featuredArticle.imageUrl && (
                    <Image 
                      src={featuredArticle.imageUrl} 
                      alt={featuredArticle.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  )}
               </div>

               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                    {featuredArticle.category && (
                      <span style={{ color: featuredArticle.category.color || 'inherit' }} className="brightness-90">
                        {featuredArticle.category.name}
                      </span>
                    )}
                    <span className="w-0.5 h-0.5 rounded-full bg-foreground/20"></span>
                    <span>{new Date(featuredArticle.createdAt).toLocaleDateString('uz-UZ')}</span>
                  </div>

                  <Link href={`/article/${featuredArticle.slug}`} className="block group-hover:opacity-95 transition-opacity">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold leading-tight tracking-tight text-foreground mb-2">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3">
                      {featuredArticle.summary}
                    </p>
                  </Link>

                  <div className="flex items-center gap-3 pt-1">
                     {/* Removed large author info for compactness */}
                     <span className="text-xs text-muted-foreground font-medium">Antigravity Team</span>
                     <span className="text-muted-foreground text-xs">•</span>
                     <span className="text-xs text-muted-foreground">{featuredArticle.readingTime || 5} min read</span>
                  </div>
               </div>
            </article>
          )}

          {/* DENSE ARTICLE GRID (3 Columns) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-foreground/5 pb-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/40">
                So'nggi Tahlillar
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {regularArticles.map((article) => (
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

                    <Link href={`/article/${article.slug}`} className="block space-y-1">
                      <h3 className="text-lg font-serif font-bold leading-snug group-hover:text-foreground/70 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-2 pt-1 border-t border-foreground/5 mt-2">
                       <span className="text-[10px] text-muted-foreground">{article.readingTime || 4} min</span>
                       <DifficultyBadge difficulty={article.difficulty} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        {/* COMPACT SIDEBAR */}
        <aside className="lg:col-span-3 self-start sticky top-24 space-y-8 pl-2 border-l border-foreground/5">
          <TrendingSection />
          <AboutWidget />
          <NewsletterSignup />
        </aside>

        <footer className="lg:col-span-12 mt-16 pt-8 border-t border-foreground/[0.05] text-center">
          <p className="text-[10px] text-foreground/30 uppercase tracking-[0.2em] font-medium">
            &copy; {new Date().getFullYear()} Antigravity. Barcha huquqlar himoyalangan.
          </p>
        </footer>
      </div>
    </div>
  );
}
