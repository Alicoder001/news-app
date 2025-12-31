import { NewsProvider } from './types';
// import { NewsApiProvider } from './providers/news-api.provider';
// import { RSSProvider } from './providers/rss.provider';
// import { GNewsProvider } from './providers/gnews.provider';
import { TheNewsAPIProvider } from './providers/thenewsapi.provider';
import { NewsAPIAiProvider } from './providers/newsapi-ai.provider';
import { RawArticleRepository } from './repositories/raw-article.repository';

/**
 * News Manager
 * 
 * Orchestrates fetching from news providers.
 * 
 * PRIMARY: NewsAPI.ai - Full article body, technology filtering
 * FALLBACK: TheNewsAPI.com - Free tier backup
 * 
 * @author Aishunos Team
 * @version 2.1.0
 */
export class NewsManager {
  private providers: NewsProvider[] = [];

  constructor() {
    // PRIMARY: NewsAPI.ai - provides FULL article content!
    // Get API key at: https://newsapi.ai
    this.registerProvider(new NewsAPIAiProvider());
    
    // FALLBACK: TheNewsAPI.com - free tier, used if NewsAPI.ai key not set
    // Get API key at: https://www.thenewsapi.com/register
    this.registerProvider(new TheNewsAPIProvider());
  }

  /**
   * Register a new provider
   */
  registerProvider(provider: NewsProvider): void {
    // Prevent duplicate registrations (HMR protection)
    if (this.providers.some(p => p.name === provider.name)) {
      console.log(`⚠️ Provider already registered: ${provider.name}`);
      return;
    }
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
   * Get debug info from all providers
   */
  getDebugInfo(): Record<string, any> {
    const debug: Record<string, any> = {};
    for (const provider of this.providers) {
      if ('lastDebugInfo' in provider) {
        debug[provider.name] = (provider as any).lastDebugInfo;
      }
    }
    return debug;
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

    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      try {
        console.log(`\n[${i + 1}/${this.providers.length}] 📰 Fetching from ${provider.name}...`);
        
        const articles = await provider.fetchArticles();
        console.log(`   → ${provider.name} returned ${articles?.length || 0} articles`);
        
        if (articles && articles.length > 0) {
          const result = await RawArticleRepository.createMany(articles);
          const savedCount = typeof result === 'number' ? result : (result as any)?.count || 0;
          
          results[provider.name] = { 
            fetched: articles.length, 
            saved: savedCount 
          };
          console.log(`   ✅ Saved ${savedCount} new articles from ${provider.name}`);
          totalSaved += savedCount;
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
