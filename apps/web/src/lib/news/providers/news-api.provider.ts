import { BaseNewsProvider, PROVIDER_CONFIG } from './base.provider';
import { RawArticleData } from '../types';

/**
 * NewsAPI.org Response Types
 */
interface NewsAPIArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsAPIResponse {
  status: 'ok' | 'error';
  totalResults: number;
  articles: NewsAPIArticle[];
  code?: string;
  message?: string;
}

/**
 * NewsAPI.org Provider
 * 
 * Fetches IT news from NewsAPI.org with:
 * - Multiple search categories
 * - Dynamic source management
 * - Proper error handling
 * - Rate limit awareness
 * 
 * @author Antigravity Team
 * @version 2.0.0
 */
export class NewsApiProvider extends BaseNewsProvider {
  name = 'NewsAPI';
  
  private apiKey: string | undefined;
  private baseUrl = 'https://newsapi.org/v2';

  constructor() {
    super();
    this.apiKey = process.env.NEWS_API_KEY;
  }

  /**
   * Check if API is available
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  /**
   * Fetch articles from NewsAPI
   */
  async fetchArticles(): Promise<RawArticleData[]> {
    if (!this.apiKey) {
      this.log('NEWS_API_KEY not found. Skipping NewsAPI fetch.', 'warn');
      return [];
    }

    this.log('Fetching technology news...');
    
    const allArticles: RawArticleData[] = [];
    const categories = PROVIDER_CONFIG.CATEGORIES.slice(0, 3); // Limit to 3 to save API calls

    for (const category of categories) {
      try {
        const articles = await this.fetchCategory(category);
        allArticles.push(...articles);
        this.log(`Fetched ${articles.length} articles for "${category}"`);
      } catch (error) {
        this.log(`Failed to fetch "${category}": ${error}`, 'warn');
      }
    }

    // Deduplicate by URL
    const uniqueArticles = this.deduplicateByUrl(allArticles);
    
    this.log(`Total: ${uniqueArticles.length} unique articles`);
    return uniqueArticles.slice(0, PROVIDER_CONFIG.MAX_ARTICLES_PER_FETCH);
  }

  /**
   * Fetch articles for a specific category
   */
  private async fetchCategory(query: string): Promise<RawArticleData[]> {
    const url = new URL(`${this.baseUrl}/everything`);
    url.searchParams.set('q', query);
    url.searchParams.set('language', 'en');
    url.searchParams.set('sortBy', 'publishedAt');
    url.searchParams.set('pageSize', '10');
    url.searchParams.set('apiKey', this.apiKey!);

    const response = await this.safeFetch(url.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NewsAPI error: ${response.status} - ${errorText}`);
    }

    const data: NewsAPIResponse = await response.json();

    if (data.status === 'error') {
      throw new Error(`NewsAPI error: ${data.code} - ${data.message}`);
    }

    // Get or create source
    const sourceId = await this.getOrCreateSource(
      `https://newsapi.org/category/${encodeURIComponent(query)}`,
      'NEWS_API'
    );

    return data.articles
      .filter(this.isValidArticle)
      .map((article) => ({
        externalId: article.url,
        title: article.title,
        description: article.description || undefined,
        content: article.content || article.description || undefined,
        url: article.url,
        publishedAt: new Date(article.publishedAt),
        sourceId,
      }));
  }

  /**
   * Validate article has required fields
   */
  private isValidArticle(article: NewsAPIArticle): boolean {
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

  /**
   * Fetch top headlines (alternative endpoint)
   */
  async fetchTopHeadlines(): Promise<RawArticleData[]> {
    if (!this.apiKey) {
      this.log('NEWS_API_KEY not found.', 'warn');
      return [];
    }

    const url = new URL(`${this.baseUrl}/top-headlines`);
    url.searchParams.set('category', 'technology');
    url.searchParams.set('language', 'en');
    url.searchParams.set('pageSize', '20');
    url.searchParams.set('apiKey', this.apiKey);

    try {
      const response = await this.safeFetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: NewsAPIResponse = await response.json();
      const sourceId = await this.getOrCreateSource(
        'https://newsapi.org/top-headlines/technology',
        'NEWS_API'
      );

      return data.articles
        .filter(this.isValidArticle)
        .map((article) => ({
          externalId: article.url,
          title: article.title,
          description: article.description || undefined,
          content: article.content || undefined,
          url: article.url,
          publishedAt: new Date(article.publishedAt),
          sourceId,
        }));
    } catch (error) {
      this.log(`Failed to fetch top headlines: ${error}`, 'error');
      return [];
    }
  }
}
