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
  const usages = await prisma.aIUsage.findMany({
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

    // By model
    if (!byModel[usage.model]) {
      byModel[usage.model] = { tokens: 0, cost: 0 };
    }
    byModel[usage.model].tokens += usage.totalTokens;
    byModel[usage.model].cost += usage.cost;

    // By operation
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

  const usages = await prisma.aIUsage.findMany({
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

  // Initialize all days
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const dateStr = d.toISOString().split('T')[0];
    dailyMap.set(dateStr, { tokens: 0, cost: 0, count: 0 });
  }

  // Aggregate data
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
