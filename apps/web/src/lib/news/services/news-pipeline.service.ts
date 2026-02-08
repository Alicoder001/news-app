import { Difficulty, Importance } from '@prisma/client';
import prisma from '@/lib/prisma';
import { RawArticleRepository } from '../repositories/raw-article.repository';
import { AIService } from './ai.service';
import { publishArticleById } from './telegram-publisher.service';
import { FilteringService } from './filtering.service';
import { getImageWithFallback } from '../utils/meta-image';

/**
 * News Processing Pipeline
 *
 * Full pipeline: RawArticle -> AI Processing -> Article -> Telegram
 */

/**
 * Calculate reading time based on word count.
 * Average reading speed: 200 words per minute.
 */
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, Math.min(minutes, 30));
}

/**
 * Calculate word count.
 */
function calculateWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}

/**
 * Find or create category by name.
 */
async function findOrCreateCategory(categoryName?: string): Promise<string | null> {
  if (!categoryName) return null;

  const slug = categoryName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  try {
    let category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          slug,
          name: categoryName,
          nameEn: categoryName,
        },
      });
      console.log(`[pipeline] category created: ${categoryName}`);
    }

    return category.id;
  } catch (error) {
    console.warn(`[pipeline] could not create category: ${categoryName}`, error);
    return null;
  }
}

/**
 * Validate and cast difficulty.
 */
function validateDifficulty(value?: string): Difficulty {
  const valid: Difficulty[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
  if (value && valid.includes(value as Difficulty)) {
    return value as Difficulty;
  }
  return 'INTERMEDIATE';
}

/**
 * Validate and cast importance.
 */
function validateImportance(value?: string): Importance {
  const valid: Importance[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  if (value && valid.includes(value as Importance)) {
    return value as Importance;
  }
  return 'MEDIUM';
}

interface PipelineResult {
  processed: number;
  skipped: number;
  errors: number;
}

interface PipelineRunOptions {
  publishToTelegram?: boolean;
}

/**
 * Main Pipeline Class.
 */
export class NewsPipeline {
  /**
   * Run the processing pipeline.
   * @param limit Max articles to process (default: all unprocessed)
   */
  static async run(limit?: number, options: PipelineRunOptions = {}): Promise<PipelineResult> {
    console.log(`[pipeline] started${limit ? ` (limit: ${limit})` : ''}`);
    const publishToTelegram = options.publishToTelegram ?? false;

    const startedAt = new Date();
    let pipelineRunId: string | null = null;

    let processed = 0;
    let skipped = 0;
    let errors = 0;
    let found = 0;

    try {
      const run = await prisma.pipelineRun.create({
        data: {
          status: 'RUNNING',
          startedAt,
        },
      });
      pipelineRunId = run.id;
    } catch (error) {
      console.warn('[pipeline] PipelineRun create failed:', error);
    }

    try {
      const rawArticles = await RawArticleRepository.getUnprocessed(limit);
      found = rawArticles.length;
      console.log(`[pipeline] found ${found} unprocessed articles`);

      if (pipelineRunId) {
        await prisma.pipelineRun.update({
          where: { id: pipelineRunId },
          data: {
            articlesFound: found,
          },
        });
      }

      for (const raw of rawArticles) {
        try {
          if (!FilteringService.shouldProcess(raw)) {
            console.log(`[pipeline] skipped by filter: ${raw.title.slice(0, 50)}...`);
            await RawArticleRepository.markAsProcessed(raw.id);
            skipped++;
            continue;
          }

          console.log(`[pipeline] processing: ${raw.title.slice(0, 50)}...`);

          const aiResult = await AIService.processArticle(
            raw.title,
            raw.content || raw.description || '',
            raw.url
          );

          const readingTime = calculateReadingTime(aiResult.content);
          const wordCount = calculateWordCount(aiResult.content);

          const categoryName = aiResult.tags?.[0] || 'technology';
          const categoryId = await findOrCreateCategory(categoryName);

          const difficulty = validateDifficulty(aiResult.difficulty);
          const importance = validateImportance(aiResult.importance);

          const rawWithImage = raw as typeof raw & { imageUrl?: string | null };
          const imageUrl = await getImageWithFallback(rawWithImage.imageUrl, raw.url);

          const article = await prisma.article.create({
            data: {
              slug: aiResult.slug,
              title: aiResult.title,
              summary: aiResult.summary,
              content: aiResult.content,
              originalUrl: raw.url,
              rawArticleId: raw.id,
              language: 'uz',
              imageUrl: imageUrl || null,
              readingTime,
              wordCount,
              difficulty,
              importance,
              categoryId,
            },
            include: {
              category: true,
            },
          });

          if (publishToTelegram) {
            await publishArticleById(article.id);
          }

          await RawArticleRepository.markAsProcessed(raw.id);
          processed++;
        } catch (error) {
          console.error(`[pipeline] error processing ${raw.id}:`, error);
          errors++;
          await RawArticleRepository.markAsProcessed(raw.id);
        }
      }

      const completedAt = new Date();
      const usageTotals = await prisma.aIUsage.aggregate({
        where: {
          createdAt: {
            gte: startedAt,
            lte: completedAt,
          },
        },
        _sum: {
          totalTokens: true,
          cost: true,
        },
      });

      if (pipelineRunId) {
        await prisma.pipelineRun.update({
          where: { id: pipelineRunId },
          data: {
            status: 'COMPLETED',
            completedAt,
            durationMs: completedAt.getTime() - startedAt.getTime(),
            articlesFound: found,
            articlesProcessed: processed,
            articlesSkipped: skipped,
            errors,
            tokensUsed: usageTotals._sum.totalTokens ?? 0,
            aiCost: usageTotals._sum.cost ?? 0,
          },
        });
      }

      console.log('[pipeline] finished');
      console.log(`  processed: ${processed}`);
      console.log(`  skipped: ${skipped}`);
      console.log(`  errors: ${errors}`);

      return { processed, skipped, errors };
    } catch (error) {
      const failedAt = new Date();

      if (pipelineRunId) {
        await prisma.pipelineRun.update({
          where: { id: pipelineRunId },
          data: {
            status: 'FAILED',
            completedAt: failedAt,
            durationMs: failedAt.getTime() - startedAt.getTime(),
            articlesFound: found,
            articlesProcessed: processed,
            articlesSkipped: skipped,
            errors,
            errorLog: error instanceof Error ? `${error.message}\n${error.stack ?? ''}` : String(error),
          },
        });
      }

      throw error;
    }
  }

  /**
   * Process a single article (for testing).
   */
  static async processOne(rawArticleId: string): Promise<void> {
    const raw = await prisma.rawArticle.findUnique({
      where: { id: rawArticleId },
      include: { source: true },
    });

    if (!raw) {
      throw new Error(`RawArticle not found: ${rawArticleId}`);
    }

    await prisma.rawArticle.update({
      where: { id: rawArticleId },
      data: { isProcessed: false },
    });

    await this.run();
  }
}
