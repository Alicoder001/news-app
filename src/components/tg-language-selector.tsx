'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { useTransition, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';

const flagEmoji = {
  uz: '🇺🇿',
  ru: '🇷🇺',
  en: '🇬🇧'
} as const;

export function TGLanguageSelector() {
  const t = useTranslations('language');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (newLocale: Locale) => {
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="relative">
      {/* Current Selection Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-foreground/[0.02] hover:bg-foreground/5 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{flagEmoji[locale]}</span>
          <span className="text-sm font-medium">{t(locale)}</span>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-foreground/50 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-foreground/10 rounded-xl shadow-xl overflow-hidden z-50">
            {routing.locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleChange(loc)}
                disabled={isPending}
                className={cn(
                  "w-full flex items-center justify-between p-4 transition-all",
                  locale === loc
                    ? "bg-foreground/5"
                    : "hover:bg-foreground/[0.02]"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{flagEmoji[loc]}</span>
                  <span className={cn(
                    "text-sm",
                    locale === loc ? "font-medium text-foreground" : "text-foreground/70"
                  )}>
                    {t(loc)}
                  </span>
                </div>
                {locale === loc && (
                  <Check className="w-4 h-4 text-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
