import { ArticleStatus } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

type CreateArticleInput = {
  rawArticleId: string;
  slug: string;
  title: string;
  shortSummary?: string;
  shortPost?: string;
  fullArticle: string;
  category: string;
  tags?: string[];
  sourceReferences?: Array<{ name: string; url: string }>;
};

export async function createDraftArticle(input: CreateArticleInput) {
  return prisma.article.create({
    data: {
      rawArticleId: input.rawArticleId,
      slug: input.slug,
      title: input.title,
      shortSummary: input.shortSummary ?? null,
      shortPost: input.shortPost ?? null,
      fullArticle: input.fullArticle,
      category: input.category,
      tags: input.tags ?? [],
      sourceReferences: input.sourceReferences ?? [],
      status: ArticleStatus.DRAFT,
    },
  });
}

export async function markArticleApproved(articleId: string, websiteUrl: string) {
  const article = await prisma.article.update({
    where: { id: articleId },
    data: {
      status: ArticleStatus.APPROVED,
      websitePublished: true,
      websitePublishedAt: new Date(),
      websiteUrl,
    },
  });

  await prisma.rawArticle.update({
    where: { id: article.rawArticleId },
    data: {
      processingState: ArticleStatus.APPROVED,
      isProcessed: true,
      holdReason: null,
      rejectReason: null,
    },
  });

  return article;
}

export async function markTelegramPublished(articleId: string, telegramMessageId: string) {
  return prisma.article.update({
    where: { id: articleId },
    data: {
      telegramPublished: true,
      telegramPublishedAt: new Date(),
      telegramMessageId,
    },
  });
}

export async function markArticleHeld(rawArticleId: string, reason: string) {
  await prisma.rawArticle.update({
    where: { id: rawArticleId },
    data: {
      processingState: ArticleStatus.HOLD,
      holdReason: reason,
    },
  });
}

export async function markArticleRejected(rawArticleId: string, reason: string) {
  await prisma.rawArticle.update({
    where: { id: rawArticleId },
    data: {
      processingState: ArticleStatus.REJECTED,
      rejectReason: reason,
      isProcessed: true,
    },
  });
}
