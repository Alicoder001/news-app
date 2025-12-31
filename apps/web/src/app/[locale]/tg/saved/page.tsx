import { TelegramBackButton } from '@/components/telegram-back-button';
import { Bookmark } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function SavedArticlesPage() {
  const t = await getTranslations('tg.saved');

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <TelegramBackButton />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-foreground/5 px-8 py-5 mb-8">
          <div className="flex items-center gap-3">
             <div className="bg-foreground/5 p-2 rounded-full">
                <Bookmark className="w-5 h-5 opacity-70" />
             </div>
             <h1 className="text-xl font-serif font-bold tracking-tight">{t('title')}</h1>
          </div>
      </header>

      <main className="container px-8 mx-auto">
          {/* Empty State for now */}
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
             <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8 opacity-40" />
             </div>
             <p className="text-sm">{t('empty')}</p>
             <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">
                {t('hint')}
             </p>
          </div>
      </main>
    </div>
  );
}

