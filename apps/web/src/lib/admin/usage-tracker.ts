/**
 * AI Usage Tracker
 * 
 * Tracks OpenAI API usage for cost monitoring
 * 
 * @author Antigravity Team
 */

import prisma from '@/lib/prisma';

/**
 * OpenAI pricing per 1M tokens (as of Dec 2024)
 */
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4o-mini': {
    input: 0.15,   // $0.15 per 1M input tokens
    output: 0.60,  // $0.60 per 1M output tokens
  },
  'gpt-4o': {
    input: 2.50,   // $2.50 per 1M input tokens
    output: 10.00, // $10.00 per 1M output tokens
  },
  'gpt-4-turbo': {
    input: 10.00,
    output: 30.00,
  },
  'gpt-3.5-turbo': {
    input: 0.50,
    output: 1.50,
  },
};

export interface UsageData {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface TrackingOptions {
  model: string;
  operation: string;
  usage: UsageData;
  articleId?: string;
}

/**
 * Calculate cost from token usage
 */
export function calculateCost(model: string, usage: UsageData): number {
  const pricing = MODEL_PRICING[model] || MODEL_PRICING['gpt-4o-mini'];
  
  const inputCost = (usage.promptTokens * pricing.input) / 1_000_000;
  const outputCost = (usage.completionTokens * pricing.output) / 1_000_000;
  
  return Number((inputCost + outputCost).toFixed(6));
}

/**
 * Track AI usage in database
 */
export async function trackAIUsage(options: TrackingOptions): Promise<void> {
  const { model, operation, usage, articleId } = options;
  const cost = calculateCost(model, usage);

  try {
    await prisma.aIUsage.create({
      data: {
        model,
        operation,
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
        cost,
        articleId,
      },
    });
  } catch (error) {
    // Don't fail the main operation if tracking fails
    console.error('Failed to track AI usage:', error);
  }
}

/**
 * Get usage statistics for a time period
 */
export async function getUsageStats(
  startDate: Date,
  endDate: Date = new Date()
): Promise<{
  totalTokens: number;
  totalCost: number;
  byModel: Record<string, { tokens: number; cost: number }>;
  byOperation: Record<string, { tokens: number; cost: number; count: number }>;
}> {
  const where = {
    createdAt: {
      gte: startDate,
      lte: endDate,
    },
  };

  const [totals, modelGroups, operationGroups] = await Promise.all([
    prisma.aIUsage.aggregate({
      where,
      _sum: {
        totalTokens: true,
        cost: true,
      },
    }),
    prisma.aIUsage.groupBy({
      by: ['model'],
      where,
      _sum: {
        totalTokens: true,
        cost: true,
      },
    }),
    prisma.aIUsage.groupBy({
      by: ['operation'],
      where,
      _sum: {
        totalTokens: true,
        cost: true,
      },
      _count: {
        _all: true,
      },
    }),
  ]);

  const byModel: Record<string, { tokens: number; cost: number }> = {};
  for (const group of modelGroups) {
    byModel[group.model] = {
      tokens: group._sum.totalTokens ?? 0,
      cost: group._sum.cost ?? 0,
    };
  }

  const byOperation: Record<string, { tokens: number; cost: number; count: number }> = {};
  for (const group of operationGroups) {
    byOperation[group.operation] = {
      tokens: group._sum.totalTokens ?? 0,
      cost: group._sum.cost ?? 0,
      count: group._count._all,
    };
  }

  return {
    totalTokens: totals._sum.totalTokens ?? 0,
    totalCost: Number((totals._sum.cost ?? 0).toFixed(4)),
    byModel,
    byOperation,
  };
}

/**
 * Get daily usage for the last N days
 */
export async function getDailyUsage(days: number = 30): Promise<
  Array<{
    date: string;
    tokens: number;
    cost: number;
    count: number;
  }>
> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const rows = await prisma.$queryRaw<
    Array<{ date: Date | string; tokens: bigint | number; cost: number; count: bigint | number }>
  >`
    SELECT
      DATE("createdAt") AS date,
      COALESCE(SUM("totalTokens"), 0) AS tokens,
      COALESCE(SUM("cost"), 0) AS cost,
      COUNT(*) AS count
    FROM "AIUsage"
    WHERE "createdAt" >= ${startDate}
    GROUP BY DATE("createdAt")
    ORDER BY DATE("createdAt") ASC
  `;

  const dailyMap = new Map<string, { tokens: number; cost: number; count: number }>();

  // Initialize all days
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const dateStr = d.toISOString().split('T')[0];
    dailyMap.set(dateStr, { tokens: 0, cost: 0, count: 0 });
  }

  // Merge aggregated daily rows
  for (const row of rows) {
    const date = row.date instanceof Date ? row.date : new Date(row.date);
    const dateStr = date.toISOString().split('T')[0];
    const existing = dailyMap.get(dateStr);
    if (existing) {
      existing.tokens += Number(row.tokens);
      existing.cost += Number(row.cost);
      existing.count += Number(row.count);
    }
  }

  return Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    tokens: data.tokens,
    cost: Number(data.cost.toFixed(4)),
    count: data.count,
  }));
}
