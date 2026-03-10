'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal' | 'dropdown';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className }: LanguageSwitcherProps) {
  const t = useTranslations('language');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  // Minimal variant - just flags/codes
  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {routing.locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleChange(loc)}
            disabled={isPending}
            className={cn(
              "px-2 py-1 text-xs font-bold uppercase tracking-wider rounded transition-colors",
              locale === loc
                ? "bg-foreground/10 text-foreground"
                : "text-foreground/40 hover:text-foreground/70"
            )}
          >
            {loc}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={cn("relative group", className)}>
        <button 
          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5"
          disabled={isPending}
        >
          <Globe className="w-4 h-4" />
          <span className="uppercase font-medium">{locale}</span>
        </button>
        
        <div className="absolute right-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-background border border-foreground/10 rounded-xl shadow-xl overflow-hidden min-w-[140px] z-50">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleChange(loc)}
              disabled={isPending}
              className={cn(
                "w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2",
                locale === loc
                  ? "bg-foreground/5 font-medium text-foreground"
                  : "text-foreground/60 hover:bg-foreground/[0.03] hover:text-foreground"
              )}
            >
              <span>{t(loc)}</span>
              {locale === loc && <span className="ml-auto text-xs opacity-50">✓</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default variant - horizontal pills
  return (
    <div className={cn("flex items-center gap-1 p-1 bg-foreground/5 rounded-full", className)}>
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleChange(loc)}
          disabled={isPending}
          className={cn(
            "px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all",
            locale === loc
              ? "bg-foreground text-background shadow-sm"
              : "text-foreground/50 hover:text-foreground/80"
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
