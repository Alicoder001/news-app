import prisma from '@/lib/prisma';
import { TelegramService } from './telegram.service';

export interface TelegramPublishResult {
  posted: boolean;
  articleId?: string;
  articleTitle?: string;
  articleUrl?: string;
  messageId?: string;
  reason?: string;
}

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://aishunos.uz';
}

function getArticleUrl(slug: string): string {
  return `${getAppUrl()}/articles/${slug}`;
}

/**
 * Select highest-priority unposted article within the time window.
 */
export async function findArticleForTelegramPosting(
  windowMinutes: number
): Promise<{ id: string; title: string; importance: string } | null> {
  const from = new Date(Date.now() - windowMinutes * 60 * 1000);

  const candidate = await prisma.article.findFirst({
    where: {
      createdAt: { gte: from },
      telegramPosted: false,
    },
    orderBy: [{ importance: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      importance: true,
    },
  });

  return candidate;
}

/**
 * Publish a single article to Telegram and persist post metadata.
 */
export async function publishArticleById(articleId: string): Promise<TelegramPublishResult> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      category: true,
    },
  });

  if (!article) {
    return { posted: false, reason: 'Article not found' };
  }

  if (article.telegramPosted) {
    return {
      posted: false,
      articleId: article.id,
      articleTitle: article.title,
      articleUrl: getArticleUrl(article.slug),
      reason: 'Already posted',
    };
  }

  const articleUrl = getArticleUrl(article.slug);

  const messageId = await TelegramService.postArticle({
    title: article.title,
    summary: article.summary || '',
    url: articleUrl,
    category: article.category?.name,
    difficulty: article.difficulty,
    importance: article.importance,
    readingTime: article.readingTime || undefined,
  });

  if (!messageId) {
    return {
      posted: false,
      articleId: article.id,
      articleTitle: article.title,
      articleUrl,
      reason: 'Telegram API failed or not configured',
    };
  }

  await prisma.article.update({
    where: { id: article.id },
    data: {
      telegramPosted: true,
      telegramPostId: messageId,
    },
  });

  return {
    posted: true,
    articleId: article.id,
    articleTitle: article.title,
    articleUrl,
    messageId,
  };
}
