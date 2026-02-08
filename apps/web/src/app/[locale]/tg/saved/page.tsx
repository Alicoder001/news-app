"use client";

import { TelegramBackButton } from '@/components/telegram-back-button';
import { useSavedArticlesContext } from '@/components/saved-articles-provider';
import { Bookmark, Trash2, Clock, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function SavedArticlesPage() {
  const t = useTranslations('tg.saved');
  const { savedArticles, removeArticle, clearAll, isLoaded, count } = useSavedArticlesContext();
  const params = useParams();
  const locale = params.locale as string;

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20">
        <TelegramBackButton />
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-foreground/5 px-8 py-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-foreground/5 p-2 rounded-full">
              <Bookmark className="w-5 h-5 opacity-70" />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-tight">{t('title')}</h1>
          </div>
        </header>
        <main className="container px-8 mx-auto">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-foreground/5 rounded-xl h-24" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <TelegramBackButton />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-foreground/5 px-8 py-5 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-foreground/5 p-2 rounded-full">
              <Bookmark className="w-5 h-5 opacity-70" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-tight">{t('title')}</h1>
              {count > 0 && (
                <p className="text-xs text-muted-foreground">{count} {t('articles')}</p>
              )}
            </div>
          </div>
          
          {count > 0 && (
            <button
              onClick={() => {
                if (confirm(t('clearConfirm'))) {
                  clearAll();
                }
              }}
              className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t('clearAll')}
            </button>
          )}
        </div>
      </header>

      <main className="container px-8 mx-auto">
        {savedArticles.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-sm">{t('empty')}</p>
            <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">
              {t('hint')}
            </p>
          </div>
        ) : (
          /* Saved Articles List */
          <div className="space-y-3">
            {savedArticles.map((article) => (
              <div
                key={article.slug}
                className="group bg-foreground/[0.02] hover:bg-foreground/[0.04] border border-foreground/5 rounded-xl overflow-hidden transition-all"
              >
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  {article.imageUrl && (
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-foreground/5">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Category badge */}
                    {article.categoryName && (
                      <span 
                        className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-1.5"
                        style={{ 
                          backgroundColor: `${article.categoryColor || '#6366f1'}20`,
                          color: article.categoryColor || '#6366f1'
                        }}
                      >
                        {article.categoryName}
                      </span>
                    )}
                    
                    {/* Title */}
                    <Link 
                      href={`/${locale}/tg/article/${article.slug}`}
                      className="block"
                    >
                      <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                    </Link>
                    
                    {/* Meta */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {article.readingTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readingTime} {t('min')}
                        </span>
                      )}
                      <span>
                        {new Date(article.savedAt).toLocaleDateString(locale, {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/${locale}/tg/article/${article.slug}`}
                      className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => removeArticle(article.slug)}
                      className="p-2 rounded-lg text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
