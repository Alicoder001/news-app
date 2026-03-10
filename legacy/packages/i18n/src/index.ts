/**
 * i18n Types
 * 
 * Type definitions for translation keys
 * 
 * @package @news-app/i18n
 */

export const SUPPORTED_LOCALES = ['uz', 'ru', 'en'] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: Locale = 'uz';

/**
 * Check if a locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

/**
 * Get locale or fallback to default
 */
export function getLocale(locale: string | undefined): Locale {
  return locale && isValidLocale(locale) ? locale : DEFAULT_LOCALE;
}
