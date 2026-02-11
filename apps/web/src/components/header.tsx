'use client';

import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function Header() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b border-transparent",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-border/40 shadow-sm py-3"
          : "bg-transparent py-4"
      )}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link 
            href="/" 
            className="text-2xl font-serif font-black tracking-tight text-foreground hover:opacity-80 transition-opacity"
          >
            {tCommon('siteName')}.
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">{t('news')}</Link>
            <Link href="#" className="hover:text-foreground transition-colors">{t('analysis')}</Link>
            <Link href="#" className="hover:text-foreground transition-colors">{t('podcasts')}</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher variant="dropdown" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
