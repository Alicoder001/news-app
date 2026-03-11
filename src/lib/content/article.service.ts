import { prisma } from '@/lib/db/prisma';
import { toAdminArticleDto, toPublicArticleDto } from './dto';

export async function listPublishedArticles(limit = 20) {
  const articles = await prisma.article.findMany({
    where: { websitePublished: true },
    orderBy: { websitePublishedAt: 'desc' },
    take: limit,
    include: {
      rawArticle: {
        include: {
          source: true,
          verificationRecord: true,
        },
      },
      deliveries: true,
    },
  });

  return articles.map(toPublicArticleDto);
}

export async function getPublishedArticleBySlug(slug: string) {
  const article = await prisma.article.findFirst({
    where: {
      slug,
      websitePublished: true,
    },
    include: {
      rawArticle: {
        include: {
          source: true,
          verificationRecord: true,
        },
      },
      deliveries: true,
    },
  });

  return article ? toPublicArticleDto(article) : null;
}

export async function listAdminArticles(limit = 50) {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      rawArticle: true,
      deliveries: true,
    },
  });

  return articles.map(toAdminArticleDto);
}

export async function getAdminArticleById(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      rawArticle: {
        include: {
          source: true,
          verificationRecord: true,
        },
      },
      deliveries: true,
    },
  });

  return article ? toAdminArticleDto(article) : null;
}
