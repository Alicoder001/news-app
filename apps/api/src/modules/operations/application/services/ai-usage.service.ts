import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

export interface UsageStats {
  totalTokens: number;
  totalCost: number;
  byModel: Record<string, { tokens: number; cost: number }>;
  byOperation: Record<string, { tokens: number; cost: number; count: number }>;
}

@Injectable()
export class AiUsageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: {
    model: string;
    operation: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
    articleId?: string;
  }) {
    await this.prisma.aIUsage.create({
      data: {
        model: input.model,
        operation: input.operation,
        promptTokens: input.promptTokens,
        completionTokens: input.completionTokens,
        totalTokens: input.totalTokens,
        cost: input.cost,
        articleId: input.articleId,
      },
    });

    return {
      success: true,
      data: { accepted: true },
    };
  }

  async stats(startDate: Date, endDate: Date = new Date()): Promise<UsageStats> {
    const usages = await this.prisma.aIUsage.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    let totalTokens = 0;
    let totalCost = 0;
    const byModel: Record<string, { tokens: number; cost: number }> = {};
    const byOperation: Record<string, { tokens: number; cost: number; count: number }> = {};

    for (const usage of usages) {
      totalTokens += usage.totalTokens;
      totalCost += usage.cost;

      if (!byModel[usage.model]) {
        byModel[usage.model] = { tokens: 0, cost: 0 };
      }
      byModel[usage.model].tokens += usage.totalTokens;
      byModel[usage.model].cost += usage.cost;

      if (!byOperation[usage.operation]) {
        byOperation[usage.operation] = { tokens: 0, cost: 0, count: 0 };
      }
      byOperation[usage.operation].tokens += usage.totalTokens;
      byOperation[usage.operation].cost += usage.cost;
      byOperation[usage.operation].count += 1;
    }

    return {
      totalTokens,
      totalCost: Number(totalCost.toFixed(4)),
      byModel,
      byOperation,
    };
  }

  async daily(days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const usages = await this.prisma.aIUsage.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const dailyMap = new Map<string, { tokens: number; cost: number; count: number }>();
    for (let i = 0; i < days; i += 1) {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const dateStr = d.toISOString().split('T')[0];
      dailyMap.set(dateStr, { tokens: 0, cost: 0, count: 0 });
    }

    for (const usage of usages) {
      const dateStr = usage.createdAt.toISOString().split('T')[0];
      const existing = dailyMap.get(dateStr);
      if (existing) {
        existing.tokens += usage.totalTokens;
        existing.cost += usage.cost;
        existing.count += 1;
      }
    }

    return Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      tokens: data.tokens,
      cost: Number(data.cost.toFixed(4)),
      count: data.count,
    }));
  }

  async recent(limit: number) {
    const rows = await this.prisma.aIUsage.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((row) => ({
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      model: row.model,
      operation: row.operation,
      promptTokens: row.promptTokens,
      completionTokens: row.completionTokens,
      totalTokens: row.totalTokens,
      cost: row.cost,
      articleId: row.articleId,
    }));
  }
}
