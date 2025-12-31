import prisma from '@/lib/prisma';
import { SourceType } from '@prisma/client';

/**
 * News Source Repository
 * 
 * Handles CRUD operations for news sources in the database.
 * 
 * @author Antigravity Team
 * @version 1.0.0
 */
export class NewsSourceRepository {
  /**
   * Get or create a news source by URL
   * Idempotent - safe to call multiple times
   */
  static async getOrCreate(
    name: string,
    url: string,
    type: SourceType = 'NEWS_API'
  ): Promise<{ id: string; isNew: boolean }> {
    const existing = await prisma.newsSource.findUnique({
      where: { url },
    });

    if (existing) {
      return { id: existing.id, isNew: false };
    }

    const created = await prisma.newsSource.create({
      data: {
        name,
        url,
        type,
        isActive: true,
      },
    });

    return { id: created.id, isNew: true };
  }

  /**
   * Update the lastFetched timestamp
   */
  static async updateLastFetched(id: string): Promise<void> {
    await prisma.newsSource.update({
      where: { id },
      data: { lastFetched: new Date() },
    });
  }

  /**
   * Get all active sources
   */
  static async getActive(): Promise<{ id: string; name: string; url: string; type: SourceType }[]> {
    return prisma.newsSource.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        url: true,
        type: true,
      },
    });
  }

  /**
   * Get sources by type
   */
  static async getByType(type: SourceType): Promise<{ id: string; name: string; url: string }[]> {
    return prisma.newsSource.findMany({
      where: { 
        isActive: true,
        type,
      },
      select: {
        id: true,
        name: true,
        url: true,
      },
    });
  }

  /**
   * Deactivate a source (soft delete)
   */
  static async deactivate(id: string): Promise<void> {
    await prisma.newsSource.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Get source statistics
   */
  static async getStats(): Promise<{
    total: number;
    active: number;
    byType: Record<string, number>;
  }> {
    const [total, active, byType] = await Promise.all([
      prisma.newsSource.count(),
      prisma.newsSource.count({ where: { isActive: true } }),
      prisma.newsSource.groupBy({
        by: ['type'],
        _count: { type: true },
      }),
    ]);

    return {
      total,
      active,
      byType: Object.fromEntries(
        byType.map(b => [b.type, b._count.type])
      ),
    };
  }
}
