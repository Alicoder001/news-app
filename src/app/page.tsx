import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryBadge } from '@/components/category-badge';
import { Tag } from '@/components/tag';
import { ImportanceBadge, DifficultyBadge } from '@/components/badges';
import { CategorySidebar } from '@/components/category-sidebar';
import { TrendingSection } from '@/components/trending-section';
import { NewsletterSignup } from '@/components/newsletter-signup';

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

      {/* Main Feed - WIDER (9/12 columns) */}
      <main className="lg:col-span-9 space-y-20">

        {/* Featured Article - HERO STYLE  - Compact */}
        {featuredArticle && (
          <article className="group relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center border-b border-border pb-8">
             <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                  {featuredArticle.category && (
                    <span style={{ color: featuredArticle.category.color || 'inherit' }} className="brightness-90">
                      {featuredArticle.category.name}
                    </span>
                  )}
                  <span className="w-0.5 h-0.5 rounded-full bg-foreground/20"></span>
                  <span>{new Date(featuredArticle.createdAt).toLocaleDateString('uz-UZ')}</span>
                </div>

                <Link href={`/article/${featuredArticle.slug}`} className="block group-hover:opacity-95 transition-opacity">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight tracking-tight text-foreground mb-4">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground font-serif leading-relaxed max-w-3xl">
                    {featuredArticle.summary}
                  </p>
                </Link>

                <div className="flex items-center gap-4 pt-2">
                   <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center">
                         <span className="text-[10px]">AG</span>
                      </div>
                      <span>Antigravity Team</span>
                   </div>
                   <span className="text-muted-foreground text-sm">•</span>
                   <span className="text-sm text-muted-foreground">{featuredArticle.readingTime || 5} min read</span>
                </div>
             </div>

             {/* Hero Image */}
             <div className="md:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
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
          </article>
        )}

        {/* Regular Articles Feed - Magazine List Layout */}
        <section className="space-y-12">
          <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/60">
              Latest Analysis
            </h2>
          </div>
          
          <div className="space-y-12">
            {regularArticles.map((article) => (
              <article key={article.id} className="group flex flex-col md:flex-row gap-8 items-start border-b border-foreground/5 pb-12 last:border-0">
                
                {/* Date Column */}
                <div className="md:w-24 shrink-0 text-xs text-muted-foreground font-medium uppercase tracking-wider pt-1.5 text-right">
                   {new Date(article.createdAt).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })}
                </div>

                {/* Content Column */}
                <div className="grow space-y-3">
                  <Link href={`/article/${article.slug}`} className="block space-y-3">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                        {article.category && (
                          <span style={{ color: article.category.color || 'inherit' }} className="brightness-90">
                            {article.category.name}
                          </span>
                        )}
                    </div>

                    <h3 className="text-2xl font-serif font-bold leading-tight group-hover:text-foreground/70 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-base leading-relaxed line-clamp-2 max-w-xl">
                      {article.summary}
                    </p>
                  </Link>
                  
                  <div className="pt-2 flex items-center gap-3">
                     <DifficultyBadge difficulty={article.difficulty} />
                     <span className="text-xs text-muted-foreground">{article.readingTime || 4} min</span>
                  </div>
                </div>

                {/* Thumbnail Image */}
                {article.imageUrl && (
                  <div className="hidden md:block w-48 shrink-0 relative aspect-[16/10] rounded-xl overflow-hidden bg-muted self-start mt-1">
                    <Image 
                      src={article.imageUrl} 
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="200px"
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

      </main>

      {/* Sidebar - Sticky */}
      <aside className="lg:col-span-3 self-start sticky top-32 space-y-12 pl-4 border-l border-foreground/5 hidden lg:block h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <CategorySidebar />
        <TrendingSection />
        <NewsletterSignup />
      </aside>

      {/* Footer */}
      <footer className="lg:col-span-12 mt-24 pt-12 border-t border-foreground/10 text-center">
        <p className="text-xs text-foreground/40 uppercase tracking-[0.2em] font-medium">
          &copy; {new Date().getFullYear()} Antigravity. Barcha huquqlar himoyalangan.
        </p>
      </footer>
    </div>
  );
}
