/**
 * Telegram Message Templates
 * 
 * Professional message templates for Telegram channel posts.
 * Supports HTML formatting and inline keyboards.
 * 
 * @author Antigravity Team
 * @version 1.0.0
 */

import { Difficulty, Importance } from '@prisma/client';

/**
 * Article data for Telegram post
 */
export interface TelegramArticle {
  title: string;
  summary: string;
  url: string;
  category?: string;
  difficulty?: Difficulty;
  importance?: Importance;
  readingTime?: number;
}

/**
 * Get emoji for difficulty level
 */
function getDifficultyEmoji(difficulty?: Difficulty): string {
  switch (difficulty) {
    case 'BEGINNER': return '🟢';
    case 'INTERMEDIATE': return '🟡';
    case 'ADVANCED': return '🟠';
    case 'EXPERT': return '🔴';
    default: return '📘';
  }
}

/**
 * Get emoji for importance level
 */
function getImportanceEmoji(importance?: Importance): string {
  switch (importance) {
    case 'LOW': return 'ℹ️';
    case 'MEDIUM': return '📌';
    case 'HIGH': return '🔥';
    case 'CRITICAL': return '🚨';
    default: return '📰';
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Standard article post template
 */
export function formatArticlePost(article: TelegramArticle): string {
  const emoji = getImportanceEmoji(article.importance);
  const diffEmoji = getDifficultyEmoji(article.difficulty);
  
  const categoryTag = article.category ? `#${article.category.replace(/\s+/g, '_')}` : '';
  const readTime = article.readingTime ? `⏱ ${article.readingTime} min` : '';
  
  const meta = [categoryTag, diffEmoji, readTime].filter(Boolean).join(' • ');
  
  return `${emoji} <b>${escapeHtml(article.title)}</b>

${escapeHtml(article.summary)}

${meta ? `\n${meta}\n` : ''}
🔗 <a href="${article.url}">Batafsil o'qish →</a>`;
}

/**
 * Breaking news template (for CRITICAL importance)
 */
export function formatBreakingNews(article: TelegramArticle): string {
  return `🚨 <b>TEZKOR XABAR</b> 🚨

<b>${escapeHtml(article.title)}</b>

${escapeHtml(article.summary)}

🔗 <a href="${article.url}">Batafsil →</a>

#tezkor #yangilik`;
}

/**
 * Weekly digest template
 */
export function formatDigest(articles: TelegramArticle[], weekNumber: number): string {
  const header = `📊 <b>Haftalik Digest #${weekNumber}</b>\n\nBu haftaning eng muhim IT yangiliklari:\n\n`;
  
  const items = articles
    .slice(0, 5)
    .map((a, i) => `${i + 1}. <a href="${a.url}">${escapeHtml(a.title)}</a>`)
    .join('\n');
  
  return header + items + '\n\n#digest #haftalik';
}

/**
 * Inline keyboard for article posts
 */
export function getArticleKeyboard(url: string, webUrl?: string): {
  inline_keyboard: Array<Array<{ text: string; url: string }>>;
} {
  const buttons: Array<{ text: string; url: string }> = [
    { text: '📖 Batafsil o\'qish', url },
  ];
  
  if (webUrl) {
    buttons.push({ text: '🌐 Saytda ko\'rish', url: webUrl });
  }
  
  return {
    inline_keyboard: [buttons],
  };
}

/**
 * Share button keyboard
 */
export function getShareKeyboard(articleUrl: string): {
  inline_keyboard: Array<Array<{ text: string; url: string }>>;
} {
  return {
    inline_keyboard: [
      [{ text: '📖 O\'qish', url: articleUrl }],
      [{ text: '📤 Do\'stlarga ulashish', url: `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}` }],
    ],
  };
}
