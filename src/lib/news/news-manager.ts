import { NewsProvider } from './types';
import { NewsApiProvider } from './providers/news-api.provider';
import { RawArticleRepository } from './repositories/raw-article.repository';

export class NewsManager {
  private providers: NewsProvider[] = [];

  constructor() {
    this.providers.push(new NewsApiProvider());
  }

  async syncAll() {
    console.log('Starting sync from all providers...');
    
    for (const provider of this.providers) {
      try {
        console.log(`Fetching from ${provider.name}...`);
        const articles = await provider.fetchArticles();
        const createdCount = await RawArticleRepository.createMany(articles);
        console.log(`Saved ${createdCount} new articles from ${provider.name}.`);
      } catch (error) {
        console.error(`Error syncing from ${provider.name}:`, error);
      }
    }
  }
}
