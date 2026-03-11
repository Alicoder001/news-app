import { prisma } from '@/lib/db/prisma';
import type { ParsedRssItem } from './types';

export async function saveRawArticle(sourceId: string, item: ParsedRssItem) {
  const existing = await prisma.rawArticle.findUnique({
    where: { canonicalUrl: item.canonicalUrl },
  });

  if (existing) {
    return {
      created: false,
      article: existing,
    };
  }

  const article = await prisma.rawArticle.create({
    data: {
      sourceId,
      title: item.title,
      summary: item.summary ?? null,
      content: item.content ?? null,
      canonicalUrl: item.canonicalUrl,
      imageUrl: item.imageUrl ?? null,
      publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
      isDuplicate: false,
      isProcessed: false,
    },
  });

  return {
    created: true,
    article,
  };
}

export async function listRawArticles() {
  return prisma.rawArticle.findMany({
    orderBy: { ingestedAt: 'desc' },
    include: {
      source: true,
      verificationRecord: true,
      article: true,
    },
  });
}
