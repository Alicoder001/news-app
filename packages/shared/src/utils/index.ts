/**
 * Utility Functions
 * 
 * Common utilities used across web and mobile apps
 * 
 * @package @news-app/shared
 */

/**
 * Combine class names, filtering out falsy values
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format date with consistent locale
 * 
 * @param date - Date to format
 * @param format - 'short' (Dec 31) | 'long' (31 dekabr 2024) | 'relative' (2 kun oldin)
 * @param locale - Locale code (uz, ru, en)
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'relative' = 'short',
  locale: string = 'uz'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return "Noma'lum sana";
  }

  const localeMap: Record<string, string> = {
    uz: 'uz-UZ',
    ru: 'ru-RU', 
    en: 'en-US',
  };
  
  const localeCode = localeMap[locale] || 'uz-UZ';

  switch (format) {
    case 'short':
      return d.toLocaleDateString(localeCode, {
        month: 'short',
        day: 'numeric',
      });
      
    case 'long':
      return d.toLocaleDateString(localeCode, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
    case 'relative':
      return getRelativeTime(d, locale);
      
    default:
      return d.toLocaleDateString(localeCode);
  }
}

/**
 * Get relative time string (e.g., "2 kun oldin")
 */
function getRelativeTime(date: Date, locale: string): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const texts: Record<string, { minute: string; hour: string; day: string; ago: string }> = {
    uz: { minute: 'daqiqa', hour: 'soat', day: 'kun', ago: 'oldin' },
    ru: { minute: 'минут', hour: 'часов', day: 'дней', ago: 'назад' },
    en: { minute: 'minutes', hour: 'hours', day: 'days', ago: 'ago' },
  };

  const t = texts[locale] || texts.uz;

  if (diffDays > 0) {
    return `${diffDays} ${t.day} ${t.ago}`;
  }
  if (diffHours > 0) {
    return `${diffHours} ${t.hour} ${t.ago}`;
  }
  if (diffMinutes > 0) {
    return `${diffMinutes} ${t.minute} ${t.ago}`;
  }
  
  return locale === 'uz' ? 'Hozirgina' : locale === 'ru' ? 'Только что' : 'Just now';
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate URL-friendly slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')    // Remove special chars
    .replace(/\s+/g, '-')             // Spaces to hyphens
    .replace(/-+/g, '-')              // Multiple hyphens to single
    .replace(/(^-|-$)/g, '');         // Trim hyphens
}
