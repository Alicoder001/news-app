import prisma from '@/lib/prisma';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { DifficultyBadge } from '@/components/badges';
import { CategoryNav } from '@/components/category-nav';
import { TrendingSection } from '@/components/trending-section';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { AboutWidget } from '@/components/about-widget';
import { HeroCarousel } from '@/components/hero-carousel';
import { TelegramCta } from '@/components/telegram-cta';
import { FeaturesBanner } from '@/components/features-banner';
import { Pagination } from '@/components/pagination';
import { getTranslations } from 'next-intl/server';

const ARTICLES_PER_PAGE = 12;

async function getArticles(page: number = 1) {
  const skip = (page - 1) * ARTICLES_PER_PAGE;
  
  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      include: {
        category: true,
        tags: true,
        rawArticle: { include: { source: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: ARTICLES_PER_PAGE,
    }),
    prisma.article.count(),
  ]);
  
  return {
    articles,
    totalPages: Math.ceil(totalCount / ARTICLES_PER_PAGE),
    currentPage: page,
  };
}

// Fetch top 3 critical/featured articles
async function getFeaturedArticles() {
  return await prisma.article.findMany({
    where: {
      importance: 'CRITICAL',
    },
    include: {
      category: true,
      tags: true,
      rawArticle: { include: { source: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
}

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  
  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');
  
  const [articlesData, featuredArticles] = await Promise.all([
    getArticles(currentPage),
    getFeaturedArticles(),
  ]);
  
  const { articles: allArticles, totalPages } = articlesData;

  // Ensure we have at least 3 featured articles for the carousel
  let finalFeaturedArticles = [...featuredArticles];
  
  if (finalFeaturedArticles.length < 3) {
    const existingIds = new Set(finalFeaturedArticles.map(a => a.id));
    const remainingNeeded = 3 - finalFeaturedArticles.length;
    
    const fillArticles = allArticles
        .filter(a => !existingIds.has(a.id))
        .slice(0, remainingNeeded);
        
    finalFeaturedArticles = [...finalFeaturedArticles, ...fillArticles];
  }
  
  // Exclude featured articles from the regular list (only on first page)
  const featuredIds = new Set(finalFeaturedArticles.map(a => a.id));
  const regularArticles = currentPage === 1 
    ? allArticles.filter(a => !featuredIds.has(a.id))
    : allArticles;

  return (
    <div className="space-y-8">
      {/* SEO: Main H1 with keywords - hidden visually but accessible */}
      <h1 className="sr-only">
        {t('seoTitle')} - IT Yangiliklar, Sun'iy Intellekt, Dasturlash, Texnologiya O'zbekistonda
      </h1>
      
      <CategoryNav />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-9 space-y-8">
          
          {/* HERO CAROUSEL SECTION */}
          {finalFeaturedArticles.length > 0 && (
             <HeroCarousel articles={finalFeaturedArticles} />
          )}

          {/* FEATURES BANNER */}
          <FeaturesBanner />

          {/* DENSE ARTICLE GRID (3 Columns) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-foreground/5 pb-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/70">
                {/* SEO Keywords in H2 */}
                <span className="sr-only">IT Yangiliklar va Texnologiya Tahlillari - </span>
                {t('latestAnalysis')}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {regularArticles.map((article) => (
                <article key={article.id} className="group flex flex-col gap-3">
                  {/* Thumbnail */}
                  <div className="relative aspect-[3/2] w-full rounded-lg overflow-hidden bg-muted">
                    {(article as unknown as { imageUrl?: string }).imageUrl && (
                      <Image 
                        src={(article as unknown as { imageUrl: string }).imageUrl} 
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
            
            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </section>
        </main>

        {/* COMPACT SIDEBAR */}
        <aside className="lg:col-span-3 self-start sticky top-24 space-y-8 pl-2 border-l border-foreground/5">
          <TrendingSection />
          <AboutWidget />
          <NewsletterSignup />
        </aside>
      </div>

      <div className="pt-16">
        <TelegramCta />
      </div>

      <footer className="mt-16 pt-8 border-t border-foreground/[0.05] text-center">
        <p className="text-[10px] text-foreground/60 uppercase tracking-[0.2em] font-medium">
          {tCommon('copyright', { year: new Date().getFullYear() })}
        </p>
      </footer>
    </div>
  );
}
