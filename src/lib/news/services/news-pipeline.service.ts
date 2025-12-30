import { RawArticleRepository } from '../repositories/raw-article.repository';
import { AIService } from './ai.service';
import { TelegramService } from './telegram.service';
import { FilteringService } from './filtering.service'; // Added
import prisma from '@/lib/prisma';

export class NewsPipeline {
  static async run() {
    console.log('Pipeline started...');

    // 1. Get unprocessed articles
    const rawArticles = await RawArticleRepository.getUnprocessed();
    console.log(`Processing ${rawArticles.length} raw articles.`);

    for (const raw of rawArticles) {
      try {
        // 1.5. Filter noise
        if (!FilteringService.shouldProcess(raw)) {
          console.log(`Skipping noise/low quality article: ${raw.title}`);
          await RawArticleRepository.markAsProcessed(raw.id);
          continue;
        }

        // 2. AI Processing
        const aiResult = await AIService.processArticle(raw.title, raw.content || raw.description || '');

        // 3. Save Canonical Article
        const article = await prisma.article.create({
          data: {
            slug: aiResult.slug,
            title: aiResult.title,
            summary: aiResult.summary,
            content: aiResult.content,
            originalUrl: raw.url,
            rawArticleId: raw.id,
            language: 'uz'
          }
        });

        // 4. Post to Telegram
        const tgPostId = await TelegramService.postArticle({
          title: article.title,
          summary: article.summary || '',
          url: `https://news-app.uz/articles/${article.slug}`
        });

        if (tgPostId) {
          await prisma.article.update({
            where: { id: article.id },
            data: { 
              telegramPosted: true,
              telegramPostId: tgPostId
            }
          });
        }

        // 5. Mark Raw as processed
        await RawArticleRepository.markAsProcessed(raw.id);
        
        console.log(`Successfully processed: ${article.title}`);
      } catch (error) {
        console.error(`Error processing article ${raw.id}:`, error);
      }
    }

    console.log('Pipeline finished.');
  }
}
