import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Qo'llab-quvvatlanadigan tillar ro'yxati
  locales: ['uz', 'ru', 'en'],
  
  // Default til (TZ talabi bo'yicha o'zbek)
  defaultLocale: 'uz',
  
  // as-needed: default locale (uz) uchun prefix yo'q
  // / -> uz, /ru -> ru, /en -> en
  localePrefix: 'as-needed',
  
  // Browser locale detection o'chirilgan
  localeDetection: false
});

// Locale type eksport - type-safe i18n uchun
export type Locale = (typeof routing.locales)[number];

