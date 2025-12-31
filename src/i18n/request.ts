import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` odatda `[locale]` segmentidan keladi
  const requested = await requestLocale;
  
  // Locale validatsiyasi - noto'g'ri bo'lsa defaultLocale ishlatiladi
  const locale = hasLocale(routing.locales, requested) 
    ? requested 
    : routing.defaultLocale;

  return {
    locale,
    // Dinamik import - faqat kerakli til yuklanadi
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
