import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { CategoryBadge } from '@/components/category-badge';
import { Tag } from '@/components/tag';
import { ImportanceBadge, DifficultyBadge } from '@/components/badges';
import { CategoryNav } from '@/components/category-nav';
import { TrendingSection } from '@/components/trending-section';
import { AdBanner } from '@/components/ad-banner';
import { SITE_CONFIG } from '@/lib/config/social';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { AboutWidget } from '@/components/about-widget';
import { HeroCarousel } from '@/components/hero-carousel';
import { TelegramCta } from '@/components/telegram-cta';
import { FeaturesCompact } from '@/components/features-banner';
import { InfiniteArticleList } from '@/components/infinite-article-list';
import { ArticleWithRelations, fetchArticlesAction } from '@/lib/news/actions';
import { getTranslations } from 'next-intl/server';
import { getFeaturedArticles as fetchFeaturedArticles } from '@/lib/api/server-api';

const ARTICLES_PER_PAGE = 12;

async function getArticles(page: number = 1) {
  return fetchArticlesAction(page, ARTICLES_PER_PAGE);
}

// Fetch top 3 critical/featured articles
async function getFeaturedArticles() {
  const response = await fetchFeaturedArticles(3);
  return ((response.data.articles as ArticleWithRelations[]) ?? []).slice(0, 3);
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
    <div className="space-y-1">
      {/* SEO: Main H1 with keywords - hidden visually but accessible */}
      <h1 className="sr-only">
        {t('seoTitle')} - IT Yangiliklar, Sun&apos;iy Intellekt, Dasturlash, Texnologiya O&apos;zbekistonda
      </h1>
      
      <CategoryNav />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <main className="lg:col-span-9 space-y-4">
          
          {/* HERO CAROUSEL SECTION */}
          {finalFeaturedArticles.length > 0 && (
             <HeroCarousel articles={finalFeaturedArticles} />
          )}


          {/* INFINITE ARTICLE GRID */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-foreground/5 pb-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/70">
                {/* SEO Keywords in H2 */}
                <span className="sr-only">IT Yangiliklar va Texnologiya Tahlillari - </span>
                {t('latestAnalysis')}
              </h2>
            </div>
            
            <InfiniteArticleList 
              initialArticles={regularArticles as ArticleWithRelations[]} 
              initialPage={1}
              totalPages={totalPages}
            />
          </section>
        </main>

        {/* COMPACT SIDEBAR */}
        <aside className="lg:col-span-3 self-start sticky top-24 space-y-6">
          <TrendingSection />
          
          {SITE_CONFIG.features.ads && (
            <div className="space-y-6">
              <AdBanner slot="sidebar-rectangle" format="rectangle" className="mx-auto" />
            </div>
          )}

          <FeaturesCompact />
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
