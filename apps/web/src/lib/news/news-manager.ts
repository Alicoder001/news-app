import { NewsProvider } from './types';
import { NewsApiProvider } from './providers/news-api.provider';
import { RSSProvider } from './providers/rss.provider';
import { GNewsProvider } from './providers/gnews.provider';
import { RawArticleRepository } from './repositories/raw-article.repository';

/**
 * News Manager
 * 
 * Orchestrates fetching from all news providers.
 * Handles provider registration and batch syncing.
 * 
 * @author Aishunos Team
 * @version 2.0.0
 */
export class NewsManager {
  private providers: NewsProvider[] = [];

  constructor() {
    // Register default providers
    this.registerProvider(new NewsApiProvider());
    this.registerProvider(new GNewsProvider());
    this.registerProvider(new RSSProvider());
  }

  /**
   * Register a new provider
   */
  registerProvider(provider: NewsProvider): void {
    this.providers.push(provider);
    console.log(`📰 Registered provider: ${provider.name}`);
  }

  /**
   * Get all registered providers
   */
  getProviders(): string[] {
    return this.providers.map(p => p.name);
  }

  /**
   * Sync articles from all providers
   */
  async syncAll(): Promise<{
    total: number;
    byProvider: Record<string, { fetched: number; saved: number }>;
    errors: string[];
  }> {
    console.log('🔄 Starting sync from all providers...');
    console.log(`📦 Registered providers: ${this.providers.map(p => p.name).join(', ')}`);
    
    const results: Record<string, { fetched: number; saved: number }> = {};
    const errors: string[] = [];
    let totalSaved = 0;

    for (const provider of this.providers) {
      try {
        console.log(`\n📰 Fetching from ${provider.name}...`);
        
        const articles = await provider.fetchArticles();
        console.log(`   → Fetched ${articles.length} articles`);
        
        if (articles.length > 0) {
          const savedCount = await RawArticleRepository.createMany(articles);
          console.log(`   ✅ Saved ${savedCount} new articles`);
          
          results[provider.name] = { 
            fetched: articles.length, 
            saved: typeof savedCount === 'number' ? savedCount : 0 
          };
          totalSaved += typeof savedCount === 'number' ? savedCount : 0;
        } else {
          results[provider.name] = { fetched: 0, saved: 0 };
        }
      } catch (error) {
        const errorMsg = `Error syncing from ${provider.name}: ${error}`;
        console.error(`   ❌ ${errorMsg}`);
        errors.push(errorMsg);
        results[provider.name] = { fetched: 0, saved: 0 };
      }
    }

    console.log(`\n✅ Sync complete. Total new articles: ${totalSaved}`);
    
    return {
      total: totalSaved,
      byProvider: results,
      errors,
    };
  }

  /**
   * Sync from a specific provider only
   */
  async syncProvider(providerName: string): Promise<{
    fetched: number;
    saved: number;
  }> {
    const provider = this.providers.find(p => p.name === providerName);
    
    if (!provider) {
      throw new Error(`Provider not found: ${providerName}`);
    }

    console.log(`📰 Syncing from ${provider.name}...`);
    const articles = await provider.fetchArticles();
    const savedCount = await RawArticleRepository.createMany(articles);

    return {
      fetched: articles.length,
      saved: typeof savedCount === 'number' ? savedCount : 0,
    };
  }

  /**
   * Get sync status/stats
   */
  getStatus(): {
    providers: string[];
    providerCount: number;
  } {
    return {
      providers: this.providers.map(p => p.name),
      providerCount: this.providers.length,
    };
  }
}

/**
 * Singleton instance for convenience
 */
export const newsManager = new NewsManager();
