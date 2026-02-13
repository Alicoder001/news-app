import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { DifficultyBadge } from '@/components/badges';
import { Bookmark, Settings, Globe, Send } from 'lucide-react';
import { TGCategoryNav } from '@/components/tg-category-nav';
import { ArticleActions } from '@/components/article-actions';
import { getTranslations } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/config/social';
import { getArticles as fetchArticles } from '@/lib/api/server-api';
import type { Difficulty } from '@news-app/api-types';

async function getArticles() {
  const response = await fetchArticles({
    limit: 20,
  });
  return (response.data.articles as Array<{
    id: string;
    slug: string;
    title: string;
    summary: string | null;
    imageUrl: string | null;
    createdAt: string;
    readingTime?: number | null;
    difficulty?: Difficulty;
    category?: { name?: string; color?: string | null } | null;
  }>) ?? [];
}

export default async function TelegramMiniApp() {
  const t = await getTranslations('tg');
  const tCommon = await getTranslations('common');
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
       {/* Mobile Header */}
       <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-foreground/5 px-8 py-5 mb-8">
          <div className="flex items-center justify-between">
             <h1 className="text-xl font-serif font-black tracking-tight">{t('header.title')}</h1>
             <div className="flex items-center gap-1 -mr-2">
                 <Link 
                    href="/tg/saved" 
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={t('saved.title')}
                 >
                    <Bookmark className="w-5 h-5" />
                 </Link>
                 <Link 
                    href="/tg/settings" 
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={t('settings.title')}
                 >
                    <Settings className="w-5 h-5" />
                 </Link>
                 <a 
                    href={SITE_CONFIG.social.telegram.channel} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Telegram Channel"
                 >
                    <Send className="w-5 h-5" />
                 </a>
                 <Link 
                    href="/" 
                    target="_blank"
                    className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={t('openInWeb')}
                 >
                    <Globe className="w-5 h-5" />
                 </Link>
             </div>
          </div>
       </header>

       <TGCategoryNav />

      {/* Main Feed */}
      <main className="container px-8 mx-auto space-y-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link 
                key={article.id} 
                href={`/tg/article/${article.slug}`}
                className="group block"
              >
                  <article className="flex flex-col gap-3 pb-4 border-b border-foreground/5 last:border-0 relative">
                     {/* Top Row: Content & Image */}
                     <div className="flex gap-4 items-center">
                         <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider font-bold text-foreground/40">
                                {article.category && (
                                    <span style={{ color: article.category.color || 'inherit' }} className="brightness-90">
                                       {article.category.name}
                                    </span>
                                )}
                                <span className="opacity-30">•</span>
                                <span>{new Date(article.createdAt).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })}</span>
                            </div>

                            <h2 className="text-base font-serif font-bold leading-snug group-hover:text-foreground/70 transition-colors line-clamp-3">
                               {article.title}
                            </h2>

                            {article.summary && (
                               <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">
                                  {article.summary}
                               </p>
                            )}
                         </div>

                         {/* Thumbnail */}
                         {article.imageUrl && (
                            <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-muted shrink-0 border border-foreground/5">
                                <Image
                                    src={article.imageUrl}
                                    alt={article.title}
                                    fill
                                    className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                    sizes="80px"
                                />
                            </div>
                         )}
                     </div>

                     {/* Bottom Row: Actions */}
                     <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] text-muted-foreground">{article.readingTime || 4} min</span>
                            {article.difficulty && <DifficultyBadge difficulty={article.difficulty} />}
                        </div>
                        <ArticleActions title={article.title} slug={article.slug} />
                     </div>
                  </article>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/40 text-sm">{t('noNews')}</p>
            </div>
          )}
      </main>

      {/* Footer Links */}
      <div className="py-8 px-8">
        <div className="flex items-center justify-center gap-3">
          <a 
              href={SITE_CONFIG.social.telegram.channel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium text-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest bg-foreground/[0.02] px-4 py-2 rounded-full"
          >
              <Send className="w-3 h-3" />
              <span>Kanal</span>
          </a>
          <Link 
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 text-xs font-medium text-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest bg-foreground/[0.02] px-4 py-2 rounded-full"
          >
              <Globe className="w-3 h-3" />
              <span>{t('openInWeb')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

