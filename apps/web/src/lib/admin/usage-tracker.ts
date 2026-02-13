/**
 * AI Usage Tracker
 * 
 * Tracks OpenAI API usage for cost monitoring
 * 
 * @author Antigravity Team
 */

import { getAdminUsageSummary, trackInternalUsage } from '@/lib/api/server-api';

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
    await trackInternalUsage({
      model,
      operation,
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      totalTokens: usage.totalTokens,
      cost,
      articleId,
    });
  } catch (error) {
    // Don't fail the main operation if tracking fails
    console.error('Failed to track AI usage:', error);
  }
}

function aggregateFromSummary(data: {
  usage: {
    totalTokens: number;
    totalCost: number;
    byModel: Record<string, { tokens: number; cost: number }>;
    byOperation: Record<string, { tokens: number; cost: number; count: number }>;
  };
}) {
  return {
    totalTokens: data.usage.totalTokens,
    totalCost: Number(data.usage.totalCost.toFixed(4)),
    byModel: data.usage.byModel,
    byOperation: data.usage.byOperation,
  };
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
  const dayDiff = Math.max(
    1,
    Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)),
  );
  const response = await getAdminUsageSummary(dayDiff);
  const data = response.data as {
    usage: {
      totalTokens: number;
      totalCost: number;
      byModel: Record<string, { tokens: number; cost: number }>;
      byOperation: Record<string, { tokens: number; cost: number; count: number }>;
    };
  };

  return aggregateFromSummary({ usage: data.usage });
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
  const response = await getAdminUsageSummary(days);
  const data = response.data as {
    daily: Array<{
      date: string;
      tokens: number;
      cost: number;
      count: number;
    }>;
  };
  return data.daily ?? [];
}
