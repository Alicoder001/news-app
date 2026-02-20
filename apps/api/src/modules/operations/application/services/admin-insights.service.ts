import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { AiUsageService } from './ai-usage.service';

@Injectable()
export class AdminInsightsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiUsageService: AiUsageService,
  ) {}

  async overview() {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalArticles,
      todayArticles,
      totalSources,
      activeSources,
      lastPipelineRun,
      recentPipelineRuns,
      recentArticles,
      usageStats,
      dailyUsage,
    ] = await Promise.all([
      this.prisma.article.count(),
      this.prisma.article.count({
        where: { createdAt: { gte: todayStart } },
      }),
      this.prisma.newsSource.count(),
      this.prisma.newsSource.count({ where: { isActive: true } }),
      this.prisma.pipelineRun.findFirst({
        orderBy: { startedAt: 'desc' },
      }),
      this.prisma.pipelineRun.findMany({
        take: 5,
        orderBy: { startedAt: 'desc' },
      }),
      this.prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      this.aiUsageService.stats(monthStart),
      this.aiUsageService.daily(14),
    ]);

    return {
      success: true,
      data: {
        totalArticles,
        todayArticles,
        totalSources,
        activeSources,
        lastPipelineRun: lastPipelineRun
          ? {
              ...lastPipelineRun,
              startedAt: lastPipelineRun.startedAt.toISOString(),
              completedAt: lastPipelineRun.completedAt
                ? lastPipelineRun.completedAt.toISOString()
                : null,
            }
          : null,
        recentPipelineRuns: recentPipelineRuns.map((run) => ({
          ...run,
          startedAt: run.startedAt.toISOString(),
          completedAt: run.completedAt ? run.completedAt.toISOString() : null,
        })),
        recentArticles: recentArticles.map((article) => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          createdAt: article.createdAt.toISOString(),
          category: article.category
            ? {
                id: article.category.id,
                name: article.category.name,
                slug: article.category.slug,
              }
            : null,
        })),
        aiUsage: usageStats,
        dailyUsage,
      },
    };
  }

  async pipelineRuns(limit: number) {
    const runs = await this.prisma.pipelineRun.findMany({
      take: limit,
      orderBy: { startedAt: 'desc' },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRuns = runs.filter((run) => run.startedAt >= today);
    const successRate =
      runs.length > 0
        ? Math.round((runs.filter((run) => run.status === 'COMPLETED').length / runs.length) * 100)
        : 0;
    const totalArticles = runs.reduce((sum, run) => sum + run.articlesProcessed, 0);
    const avgDuration =
      runs.length > 0
        ? Math.round(runs.reduce((sum, run) => sum + (run.durationMs ?? 0), 0) / runs.length / 1000)
        : 0;

    return {
      success: true,
      data: {
        runs: runs.map((run) => ({
          ...run,
          startedAt: run.startedAt.toISOString(),
          completedAt: run.completedAt ? run.completedAt.toISOString() : null,
        })),
        todayRuns: todayRuns.length,
        successRate,
        totalArticles,
        avgDuration,
      },
    };
  }

  async settings() {
    const [settings, articlesCount, sourcesCount, pipelineRuns] = await Promise.all([
      this.prisma.systemSetting.findMany(),
      this.prisma.article.count(),
      this.prisma.newsSource.count(),
      this.prisma.pipelineRun.count(),
    ]);

    const settingsMap: Record<string, string> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }

    return {
      success: true,
      data: {
        settings: settingsMap,
        systemInfo: {
          articlesCount,
          sourcesCount,
          pipelineRuns,
          nodeVersion: process.version,
          nextVersion: '15+',
        },
      },
    };
  }
}
