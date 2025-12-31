'use client';

import { Send, Smartphone, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TelegramCta() {
  const t = useTranslations('common.community');

  return (
    <section className="py-24 border-t border-foreground/[0.03]">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Channel Card */}
          <a 
            href="https://t.me/antigravity_news" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex flex-col justify-between p-10 rounded-3xl border border-foreground/[0.08] bg-foreground/[0.02] hover:bg-foreground/[0.04] hover:border-foreground/[0.12] transition-all duration-500"
          >
            <div className="relative space-y-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-500">
                <Send className="w-6 h-6" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-serif font-bold tracking-tight text-foreground">
                  {t('channelTitle')}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {t('channelDesc')}
                </p>
              </div>
            </div>
              
            <div className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-foreground/80 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <span>{t('channelBtn')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* Mini App Card */}
          <a 
            href="https://t.me/antigravity_bot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex flex-col justify-between p-10 rounded-3xl border border-foreground/[0.08] bg-foreground/[0.02] hover:bg-foreground/[0.04] hover:border-foreground/[0.12] transition-all duration-500"
          >
            <div className="relative space-y-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                <Smartphone className="w-6 h-6" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-serif font-bold tracking-tight text-foreground">
                  {t('botTitle')}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {t('botDesc')}
                </p>
              </div>
            </div>
              
            <div className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-foreground/80 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              <span>{t('botBtn')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

        </div>
      </div>
    </section>
  );
}
