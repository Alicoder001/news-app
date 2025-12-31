import { BaseNewsProvider, PROVIDER_CONFIG } from './base.provider';
import { RawArticleData } from '../types';

/**
 * TheNewsAPI Response Types
 * @see https://www.thenewsapi.com/documentation
 */
interface TheNewsAPIArticle {
  uuid: string;
  title: string;
  description: string;
  keywords: string;
  snippet: string;
  url: string;
  image_url: string | null;
  language: string;
  published_at: string;
  source: string;
  categories: string[];
  relevance_score: number | null;
}

interface TheNewsAPIResponse {
  meta: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
  data: TheNewsAPIArticle[];
}

/**
 * TheNewsAPI.com Provider
 * 
 * Features:
 * - Free tier: 100 requests/day, 3 articles per request
 * - Full access to tech category
 * - Search by title and main_text
 * - No content truncation (snippet provided, full article via URL)
 * - Global coverage with multiple languages
 * 
 * @see https://www.thenewsapi.com/documentation
 * @author Aishunos Team
 * @version 1.0.0
 */
export class TheNewsAPIProvider extends BaseNewsProvider {
  name = 'TheNewsAPI';
  
  private baseUrl = 'https://api.thenewsapi.com/v1';

  /**
   * Get API key dynamically
   */
  private get apiKey(): string | undefined {
    return process.env.THENEWSAPI_KEY;
  }

  /**
   * Check if API is available
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  /**
   * Fetch articles from TheNewsAPI
   */
  async fetchArticles(): Promise<RawArticleData[]> {
    const currentKey = this.apiKey;
    
    // DEBUG: Log token status
    this.log(`API Key status: ${currentKey ? 'FOUND (' + currentKey.slice(0, 8) + '...)' : 'NOT FOUND'}`);
    
    if (!currentKey) {
      this.log('THENEWSAPI_KEY not found. Skipping TheNewsAPI fetch.', 'warn');
      return [];
    }

    this.log('Fetching technology news from TheNewsAPI...');
    
    try {
      const articles = await this.fetchTechNews();
      this.log(`Fetched ${articles.length} articles from TheNewsAPI`);
      return articles.slice(0, PROVIDER_CONFIG.MAX_ARTICLES_PER_FETCH);
    } catch (error) {
      this.log(`Failed to fetch from TheNewsAPI: ${error}`, 'error');
      return [];
    }
  }

  /**
   * Fetch technology news using All News endpoint
   */
  private async fetchTechNews(): Promise<RawArticleData[]> {
    const url = new URL(`${this.baseUrl}/news/all`);
    url.searchParams.set('api_token', this.apiKey!);
    url.searchParams.set('categories', 'tech');
    url.searchParams.set('language', 'en');
    url.searchParams.set('limit', '10'); // Max for free tier is 3, but we request 10 for paid plans
    url.searchParams.set('sort', 'published_at');

    return this.fetchFromEndpoint(url.toString());
  }

  /**
   * Fetch from TheNewsAPI endpoint
   */
  private async fetchFromEndpoint(url: string): Promise<RawArticleData[]> {
    const response = await this.safeFetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TheNewsAPI error: ${response.status} - ${errorText}`);
    }

    const data: TheNewsAPIResponse = await response.json();

    if (!data.data || data.data.length === 0) {
      this.log('No articles found from TheNewsAPI');
      return [];
    }

    // Get or create source
    const sourceId = await this.getOrCreateSource(
      'https://api.thenewsapi.com',
      'NEWS_API'
    );

    // Use arrow function to preserve context
    const validArticles = data.data.filter((article) => this.isValidArticle(article));
    this.log(`Valid articles after filter: ${validArticles.length}`);

    return validArticles.map((article) => ({
      externalId: article.uuid,
      title: article.title,
      description: article.description || undefined,
      content: article.snippet || article.description || undefined,
      url: article.url,
      imageUrl: article.image_url || undefined,
      publishedAt: new Date(article.published_at),
      sourceId,
    }));
  }

  /**
   * Validate article has required fields
   */
  private isValidArticle(article: TheNewsAPIArticle): boolean {
    return !!(
      article.title &&
      article.url &&
      article.uuid &&
      article.title !== '[Removed]' &&
      !article.title.toLowerCase().includes('[removed]')
    );
  }
}
