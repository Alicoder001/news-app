import prisma from '@/lib/prisma';
import { RawArticleData } from '../types';

export class RawArticleRepository {
  static async exists(url: string) {
    const count = await prisma.rawArticle.count({
      where: { url }
    });
    return count > 0;
  }

  static async createMany(articles: RawArticleData[]) {
    // Filter out existing ones to avoid P2002 (Unique constraint)
    const existingUrls = await prisma.rawArticle.findMany({
      where: {
        url: { in: articles.map(a => a.url) }
      },
      select: { url: true }
    });

    const existingUrlSet = new Set(existingUrls.map(e => e.url));
    const newArticles = articles.filter(a => !existingUrlSet.has(a.url));

    if (newArticles.length === 0) return 0;

    return await prisma.rawArticle.createMany({
      data: newArticles.map(a => ({
        externalId: a.externalId,
        title: a.title,
        description: a.description,
        content: a.content,
        url: a.url,
        publishedAt: a.publishedAt,
        sourceId: a.sourceId,
      })),
      skipDuplicates: true,
    });
  }

  static async getUnprocessed() {
    return await prisma.rawArticle.findMany({
      where: { isProcessed: false },
      include: { source: true },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async markAsProcessed(id: string) {
    return await prisma.rawArticle.update({
      where: { id },
      data: { 
        isProcessed: true,
        processedAt: new Date()
      }
    });
  }
}
