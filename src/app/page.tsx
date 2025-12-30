import prisma from '@/lib/prisma';
import Link from 'next/link';
import { CategoryBadge } from '@/components/category-badge';
import { Tag } from '@/components/tag';
import { ImportanceBadge, DifficultyBadge } from '@/components/badges';
import { CategorySidebar } from '@/components/category-sidebar';
import { TrendingSection } from '@/components/trending-section';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { Star, Newspaper, Clock, Eye } from 'lucide-react';

async function getArticles() {
  return await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      category: true,
      tags: true,
      rawArticle: {
        include: {
          source: true,
        },
      },
    },
  });
}

async function getFeaturedArticle() {
  // Get highest importance + most recent
  return await prisma.article.findFirst({
    where: {
      importance: { in: ['HIGH', 'CRITICAL'] },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      tags: true,
      rawArticle: {
        include: {
          source: true,
        },
      },
    },
  });
}

export default async function Home() {
  const [articles, featuredArticle] = await Promise.all([
    getArticles(),
    getFeaturedArticle(),
  ]);

  // Filter out featured from regular list
  const regularArticles = articles.filter(a => a.id !== featuredArticle?.id);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden border-b border-white/5">
        <div className="container px-4 mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium tracking-wide uppercase rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-blue-400">
            Insights for the Future
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight gradient-text">
            IT News, Deciphered.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-foreground/60 leading-relaxed italic font-light">
            "Context matters more than speed. We filter the noise to bring you the signal."
          </p>
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <main className="flex-grow container px-4 mx-auto py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Left Column - Articles */}
          <div className="space-y-8">
            {/* Featured Article */}
            {featuredArticle && (
              <article className="group cursor-pointer bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300">
                <Link href={`/articles/${featuredArticle.slug}`}>
                  <div className="space-y-4">
                    {/* Featured Badge */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-current" /> Featured
                      </span>
                      {featuredArticle.category && (
                        <CategoryBadge category={featuredArticle.category} size="md" />
                      )}
                      <ImportanceBadge importance={featuredArticle.importance} />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold group-hover:text-blue-400 transition-colors leading-tight">
                      {featuredArticle.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-xl text-foreground/70 leading-relaxed line-clamp-3">
                      {featuredArticle.summary}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 flex-wrap text-sm text-foreground/50">
                      <span className="flex items-center gap-1.5">
                        <Newspaper className="w-3.5 h-3.5" /> {featuredArticle.rawArticle.source.name}
                      </span>
                      <span>•</span>
                      <span>{new Date(featuredArticle.createdAt).toLocaleDateString('uz-UZ')}</span>
                      {featuredArticle.readingTime && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {featuredArticle.readingTime} daqiqa
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <DifficultyBadge difficulty={featuredArticle.difficulty} />
                    </div>

                    {/* Tags */}
                    {featuredArticle.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap pt-2">
                        {featuredArticle.tags.slice(0, 4).map((tag) => (
                          <Tag key={tag.id} tag={tag} />
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 text-blue-400 font-medium">
                        Read Full Analysis <span>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* Regular Articles */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Newspaper className="w-6 h-6" /> So'nggi Maqolalar
              </h2>
              
              {regularArticles.map((article) => (
                <article key={article.id} className="group cursor-pointer">
                  <Link href={`/articles/${article.slug}`}>
                    <div className="flex flex-col gap-4 p-6 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-300">
                      {/* Metadata Row */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {article.category && (
                          <CategoryBadge category={article.category} size="sm" />
                        )}
                        {article.importance !== 'MEDIUM' && (
                          <ImportanceBadge importance={article.importance} />
                        )}
                        <div className="flex items-center gap-2 text-xs text-foreground/40">
                          <span>{new Date(article.createdAt).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })}</span>
                          {article.readingTime && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {article.readingTime} min
                              </span>
                            </>
                          )}
                          {article.viewCount > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" /> {article.viewCount}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <DifficultyBadge difficulty={article.difficulty} />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors leading-snug">
                        {article.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-foreground/60 leading-relaxed line-clamp-2">
                        {article.summary}
                      </p>

                      {/* Tags */}
                      {article.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Tag key={tag.id} tag={tag} size="sm" variant="subtle" />
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              ))}

              {regularArticles.length === 0 && (
                <div className="text-center py-12 text-foreground/40">
                  <p>Hozircha yangiliklar yo'q</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            <TrendingSection />
            <CategorySidebar />
            <NewsletterSignup />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 mt-12">
        <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
          <div className="text-sm font-medium tracking-tight">© 2024 ANTIGRAVITY NEWS</div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-foreground transition-colors">Telegram</a>
            <a href="#" className="hover:text-foreground transition-colors">RSS Feed</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
