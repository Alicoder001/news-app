'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: {
    category: true;
    tags: true;
    rawArticle: { include: { source: true } }
  }
}>;

export async function fetchArticlesAction(
  page: number = 1,
  pageSize: number = 12,
  categoryId?: string,
  tagId?: string
) {
  const skip = (page - 1) * pageSize;

  const where: Prisma.ArticleWhereInput = {};
  
  if (categoryId) {
    where.categoryId = categoryId;
  }
  
  if (tagId) {
    where.tags = {
      some: {
        id: tagId
      }
    };
  }

  try {
    const articles = await prisma.article.findMany({
      where,
      include: {
        category: true,
        tags: true,
        rawArticle: { include: { source: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    });

    const totalCount = await prisma.article.count({ where });

    return {
      articles,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      articles: [],
      totalPages: 0,
      currentPage: page,
      error: 'Failed to fetch articles'
    };
  }
}
