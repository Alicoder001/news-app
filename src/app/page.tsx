import prisma from '@/lib/prisma';
import Link from 'next/link';
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

              {/* Main Feed - WIDER (9/12 columns) */}
              <main className="lg:col-span-9 space-y-16">

                {/* Featured Article */}
                {featuredArticle && (
                  <article className="group pb-8 mb-8">
                    <Link href={`/article/${featuredArticle.slug}`} className="block space-y-4">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                        {featuredArticle.category && (
                          <span style={{ color: featuredArticle.category.color || 'inherit' }} className="brightness-90">
                            {featuredArticle.category.name}
                          </span>
                        )}
                        <span className="w-0.5 h-0.5 rounded-full bg-foreground/20"></span>
                        <span>{new Date(featuredArticle.createdAt).toLocaleDateString('uz-UZ')}</span>
                      </div>

                      <h2 className="text-2xl lg:text-3xl font-serif font-medium leading-tight group-hover:text-foreground/70 transition-colors">
                        {featuredArticle.title}
                      </h2>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {featuredArticle.summary}
                      </p>
                    </Link>
                  </article>
                )}

      

                {/* Regular Articles Feed - Grid Layout */}

                <section className="space-y-10">

                  <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/40 border-b border-foreground/5 pb-4">

                    So'nggi Tahlillar

                  </h2>

                  

                  <div className="grid grid-cols-1 gap-y-12">

                    {regularArticles.map((article) => (

                      <article key={article.id} className="group flex flex-col h-full justify-between pb-8 border-b border-foreground/10">

                        <Link href={`/article/${article.slug}`} className="block space-y-4">

                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">

                            {article.category && (

                              <span style={{ color: article.category.color || 'inherit' }} className="brightness-90">

                                {article.category.name}

                              </span>

                            )}

                            <span className="w-0.5 h-0.5 rounded-full bg-foreground/20"></span>

                            <span>{new Date(article.createdAt).toLocaleDateString('uz-UZ')}</span>

                          </div>

      

                          <h3 className="text-xl font-serif font-medium leading-tight group-hover:text-foreground/70 transition-colors">

                            {article.title}

                          </h3>

                          

                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">

                            {article.summary}

                          </p>

                        </Link>

      

                        <div className="flex items-center gap-3 pt-4 mt-auto">

                           <DifficultyBadge difficulty={article.difficulty} />

                           <span className="text-[10px] text-muted-foreground/50 font-medium">

                              {article.readingTime || 3} min

                           </span>

                        </div>

                      </article>

                    ))}

                  </div>

                </section>

      

              </main>

      

              {/* Sidebar - Sticky */}
              <aside className="lg:col-span-3 self-start sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-10 pl-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                <CategorySidebar />
                
                <TrendingSection />

                <NewsletterSignup />

              </aside>

      {/* Footer */}
      <footer className="lg:col-span-12 mt-24 pt-12 border-t border-foreground/[0.05] text-center">
        <p className="text-xs text-foreground/30 uppercase tracking-[0.2em] font-medium">
          &copy; {new Date().getFullYear()} Antigravity. Barcha huquqlar himoyalangan.
        </p>
      </footer>
    </div>
  );
}
