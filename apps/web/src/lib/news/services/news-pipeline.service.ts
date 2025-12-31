import { RawArticleRepository } from '../repositories/raw-article.repository';
import { AIService } from './ai.service';
import { TelegramService } from './telegram.service';
import { FilteringService } from './filtering.service';
import prisma from '@/lib/prisma';
import { Difficulty, Importance } from '@prisma/client';

/**
 * News Processing Pipeline
 * 
 * Full pipeline: RawArticle → AI Processing → Article → Telegram
 * 
 * @author Antigravity Team
 * @version 2.0.0
 */

/**
 * Calculate reading time based on word count
 * Average reading speed: 200 words per minute
 */
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, Math.min(minutes, 30)); // Min 1, Max 30 minutes
}

/**
 * Calculate word count
 */
function calculateWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}

/**
 * Find or create category by name
 */
async function findOrCreateCategory(categoryName?: string): Promise<string | null> {
  if (!categoryName) return null;
  
  // Normalize category name
  const slug = categoryName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  try {
    // Try to find existing
    let category = await prisma.category.findUnique({
      where: { slug },
    });
    
    // Create if not exists
    if (!category) {
      category = await prisma.category.create({
        data: {
          slug,
          name: categoryName,
          nameEn: categoryName,
        },
      });
      console.log(`📁 Created category: ${categoryName}`);
    }
    
    return category.id;
  } catch (error) {
    console.warn(`⚠️ Could not create category: ${categoryName}`, error);
    return null;
  }
}

/**
 * Validate and cast difficulty
 */
function validateDifficulty(value?: string): Difficulty {
  const valid: Difficulty[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
  if (value && valid.includes(value as Difficulty)) {
    return value as Difficulty;
  }
  return 'INTERMEDIATE';
}

/**
 * Validate and cast importance
 */
function validateImportance(value?: string): Importance {
  const valid: Importance[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  if (value && valid.includes(value as Importance)) {
    return value as Importance;
  }
  return 'MEDIUM';
}

/**
 * Main Pipeline Class
 */
export class NewsPipeline {
  /**
   * Run the full processing pipeline
   */
  static async run(): Promise<{
    processed: number;
    skipped: number;
    errors: number;
  }> {
    console.log('🚀 Pipeline started...');
    
    let processed = 0;
    let skipped = 0;
    let errors = 0;

    // 1. Get unprocessed articles
    const rawArticles = await RawArticleRepository.getUnprocessed();
    console.log(`📦 Found ${rawArticles.length} unprocessed articles`);

    for (const raw of rawArticles) {
      try {
        // 2. Filter noise
        if (!FilteringService.shouldProcess(raw)) {
          console.log(`⏭️ Skipping: ${raw.title.slice(0, 50)}...`);
          await RawArticleRepository.markAsProcessed(raw.id);
          skipped++;
          continue;
        }

        console.log(`\n🔄 Processing: ${raw.title.slice(0, 50)}...`);

        // 3. AI Processing
        const aiResult = await AIService.processArticle(
          raw.title, 
          raw.content || raw.description || '',
          raw.url
        );

        // 4. Calculate metadata
        const readingTime = calculateReadingTime(aiResult.content);
        const wordCount = calculateWordCount(aiResult.content);
        
        // 5. Handle category (from AI tags or default)
        const categoryName = aiResult.tags?.[0] || 'technology';
        const categoryId = await findOrCreateCategory(categoryName);

        // 6. Validate enums
        const difficulty = validateDifficulty(aiResult.difficulty);
        const importance = validateImportance(aiResult.importance);

        // 7. Save Canonical Article with ALL fields
        const article = await prisma.article.create({
          data: {
            slug: aiResult.slug,
            title: aiResult.title,
            summary: aiResult.summary,
            content: aiResult.content,
            originalUrl: raw.url,
            rawArticleId: raw.id,
            language: 'uz',
            // Metadata
            readingTime,
            wordCount,
            difficulty,
            importance,
            // Category
            categoryId,
          },
          include: {
            category: true,
          },
        });

        console.log(`   ✅ Saved: ${article.title.slice(0, 40)}...`);
        console.log(`   📊 ${readingTime} min | ${difficulty} | ${importance}`);

        // 8. Post to Telegram with FULL metadata
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://news-app.uz';
        const articleUrl = `${baseUrl}/articles/${article.slug}`;
        
        const tgPostId = await TelegramService.postArticle({
          title: article.title,
          summary: article.summary || '',
          url: articleUrl,
          category: article.category?.name,
          difficulty: article.difficulty,
          importance: article.importance,
          readingTime: article.readingTime || undefined,
        });

        if (tgPostId) {
          await prisma.article.update({
            where: { id: article.id },
            data: { 
              telegramPosted: true,
              telegramPostId: tgPostId,
            },
          });
          console.log(`   📱 Posted to Telegram`);
        }

        // 9. Mark Raw as processed
        await RawArticleRepository.markAsProcessed(raw.id);
        processed++;
        
      } catch (error) {
        console.error(`❌ Error processing ${raw.id}:`, error);
        errors++;
        // Still mark as processed to avoid infinite loop
        await RawArticleRepository.markAsProcessed(raw.id);
      }
    }

    console.log(`\n✅ Pipeline finished:`);
    console.log(`   Processed: ${processed}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors: ${errors}`);

    return { processed, skipped, errors };
  }

  /**
   * Process a single article (for testing)
   */
  static async processOne(rawArticleId: string): Promise<void> {
    const raw = await prisma.rawArticle.findUnique({
      where: { id: rawArticleId },
      include: { source: true },
    });

    if (!raw) {
      throw new Error(`RawArticle not found: ${rawArticleId}`);
    }

    // Temporarily set as unprocessed and run pipeline
    await prisma.rawArticle.update({
      where: { id: rawArticleId },
      data: { isProcessed: false },
    });

    await this.run();
  }
}
