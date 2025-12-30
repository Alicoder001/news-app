import { TelegramBackButton } from '@/components/telegram-back-button';
import { Settings, Moon, Globe, Info, ChevronRight, Monitor, Sun } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <TelegramBackButton />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-foreground/5 px-8 py-5 mb-8">
          <div className="flex items-center gap-3">
             <div className="bg-foreground/5 p-2 rounded-full">
                <Settings className="w-5 h-5 opacity-70" />
             </div>
             <h1 className="text-xl font-serif font-bold tracking-tight">Sozlamalar</h1>
          </div>
      </header>

      <main className="container px-8 mx-auto space-y-8">
          
          {/* Section: Appearance */}
          <section className="space-y-3">
             <h2 className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-2">Ko'rinish</h2>
             <div className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                           <Moon className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium">Tungi rejim</div>
                    </div>
                    <ThemeToggle />
                </div>
             </div>
          </section>

          {/* Section: General */}
          <section className="space-y-3">
             <h2 className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-2">Umumiy</h2>
             <div className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-orange-500/10 text-orange-500">
                           <Globe className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium">Tilni o'zgartirish</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">O'zbekcha</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground/50 transition-colors" />
                    </div>
                </div>
             </div>
          </section>

          {/* Section: About */}
          <section className="space-y-3">
             <h2 className="text-xs uppercase tracking-widest font-bold text-foreground/40 pl-2">Ilova haqida</h2>
             <div className="bg-foreground/[0.02] border border-foreground/5 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-purple-500/10 text-purple-500">
                           <Info className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium">Versiya</div>
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
