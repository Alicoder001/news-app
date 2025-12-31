import { BaseNewsProvider, PROVIDER_CONFIG } from './base.provider';
import { RawArticleData } from '../types';

/**
 * GNews API Response Types
 */
interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

/**
 * GNews.io Provider
 * 
 * Fetches IT news from GNews.io (Google News API) with:
 * - High-quality curated news from Google News
 * - Multiple search topics
 * - Clean, structured data
 * - Free tier: 100 requests/day
 * 
 * @see https://gnews.io/docs/v4
 * @author Aishunos Team
 * @version 1.0.0
 */
export class GNewsProvider extends BaseNewsProvider {
  name = 'GNews';
  
  private baseUrl = 'https://gnews.io/api/v4';

  /**
   * Get API key dynamically (ensures env is loaded)
   */
  private get apiKey(): string | undefined {
    return process.env.GNEWS_API_KEY;
  }

  /**
   * Check if API is available
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  /**
   * Fetch articles from GNews
   */
  async fetchArticles(): Promise<RawArticleData[]> {
    const currentKey = this.apiKey;
    
    if (!currentKey) {
      this.log('GNEWS_API_KEY not found. Skipping GNews fetch.', 'warn');
      return [];
    }

    this.log('Fetching technology news from Google News...');
    
    // Only fetch top headlines (1 request = 10 articles)
    // This saves API quota: 100 requests/day = 100 syncs/day
    try {
      const topHeadlines = await this.fetchTopHeadlines();
      this.log(`Fetched ${topHeadlines.length} headlines from GNews`);
      return topHeadlines.slice(0, PROVIDER_CONFIG.MAX_ARTICLES_PER_FETCH);
    } catch (error) {
      this.log(`Failed to fetch from GNews: ${error}`, 'warn');
      return [];
    }
  }

  /**
   * Fetch top headlines in technology category
   */
  private async fetchTopHeadlines(): Promise<RawArticleData[]> {
    const url = new URL(`${this.baseUrl}/top-headlines`);
    url.searchParams.set('category', 'technology');
    url.searchParams.set('lang', 'en');
    url.searchParams.set('max', '10'); // Fetch up to 10 articles per sync
    url.searchParams.set('token', this.apiKey!);

    return this.fetchFromEndpoint(url.toString(), 'top-headlines/technology');
  }

  /**
   * Fetch articles for a specific topic
   */
  private async fetchTopic(query: string): Promise<RawArticleData[]> {
    const url = new URL(`${this.baseUrl}/search`);
    url.searchParams.set('q', query);
    url.searchParams.set('lang', 'en');
    url.searchParams.set('max', '5');
    url.searchParams.set('token', this.apiKey!);

    return this.fetchFromEndpoint(url.toString(), `search/${query}`);
  }

  /**
   * Fetch from GNews endpoint
   */
  private async fetchFromEndpoint(
    url: string,
    sourceIdentifier: string
  ): Promise<RawArticleData[]> {
    const response = await this.safeFetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GNews API error: ${response.status} - ${errorText}`);
    }

    const data: GNewsResponse = await response.json();

    // Get or create source
    const sourceId = await this.getOrCreateSource(
      `https://gnews.io/${sourceIdentifier}`,
      'NEWS_API' // Using NEWS_API type as it's an API provider
    );

    return data.articles
      .filter(this.isValidArticle)
      .map((article) => ({
        externalId: article.url,
        title: article.title,
        description: article.description || undefined,
        content: article.content || article.description || undefined,
        url: article.url,
        imageUrl: article.image || undefined, // GNews image
        publishedAt: new Date(article.publishedAt),
        sourceId,
      }));
  }

  /**
   * Validate article has required fields
   */
  private isValidArticle(article: GNewsArticle): boolean {
    return !!(
      article.title &&
      article.url &&
      article.title !== '[Removed]' &&
      !article.title.toLowerCase().includes('[removed]')
    );
  }

  /**
   * Remove duplicate articles by URL
   */
  private deduplicateByUrl(articles: RawArticleData[]): RawArticleData[] {
    const seen = new Set<string>();
    return articles.filter((article) => {
      if (seen.has(article.url)) {
        return false;
      }
      seen.add(article.url);
      return true;
    });
  }
}
