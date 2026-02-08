import { TelegramBackButton } from '@/components/telegram-back-button';
import { Settings, Moon, Info, Send, Globe, ExternalLink } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { getTranslations } from 'next-intl/server';
import { TGLanguageSelector } from '@/components/tg-language-selector';

export default async function SettingsPage() {
  const t = await getTranslations('tg.settings');

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <TelegramBackButton />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-foreground/5 px-8 py-5 mb-8">
          <div className="flex items-center gap-3">
             <div className="bg-foreground/5 p-2 rounded-full">
                <Settings className="w-5 h-5 opacity-70" />
             </div>
             <h1 className="text-xl font-serif font-bold tracking-tight">{t('title')}</h1>
          </div>
      </header>

      <main className="container px-8 mx-auto space-y-8">
          
          {/* Section: Appearance */}
          <section className="space-y-3">
             <h2 className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-2">{t('appearance')}</h2>
             <div className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                           <Moon className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium">{t('darkMode')}</div>
                    </div>
                    <ThemeToggle />
                </div>
             </div>
          </section>

          {/* Section: Language */}
          <section className="space-y-3">
             <h2 className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-2">{t('language')}</h2>
             <div className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl p-2">
                <TGLanguageSelector />
             </div>
          </section>

          {/* Section: Community */}
          <section className="space-y-3">
             <h2 className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-2">Hamjamiyat</h2>
             <div className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl overflow-hidden">
                <a 
                   href="https://t.me/your_channel" 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center justify-between p-4 border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-sky-500/10 text-sky-500">
                           <Send className="w-4 h-4" />
                        </div>
                        <div>
                           <div className="text-sm font-medium">Telegram Kanal</div>
                           <div className="text-xs text-muted-foreground">Yangiliklar va yangilanishlar</div>
                        </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground/50" />
                </a>
                <a 
                   href="/" 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center justify-between p-4 hover:bg-foreground/[0.02] transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500">
                           <Globe className="w-4 h-4" />
                        </div>
                        <div>
                           <div className="text-sm font-medium">Veb-sayt</div>
                           <div className="text-xs text-muted-foreground">To'liq versiyada o'qish</div>
                        </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground/50" />
                </a>
             </div>
          </section>

          {/* Section: About */}
          <section className="space-y-3">
             <h2 className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-2">{t('about')}</h2>
             <div className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-purple-500/10 text-purple-500">
                           <Info className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium">{t('version')}</div>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">1.0.0 (Beta)</span>
                </div>
             </div>
          </section>

          <div className="pt-8 text-center">
             <p className="text-[10px] uppercase tracking-widest text-foreground/20">Antigravity © 2025</p>
          </div>

      </main>
    </div>
  );
}

