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
  
  private apiKey: string | undefined;
  private baseUrl = 'https://gnews.io/api/v4';

  constructor() {
    super();
    this.apiKey = process.env.GNEWS_API_KEY;
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
    if (!this.apiKey) {
      this.log('GNEWS_API_KEY not found. Skipping GNews fetch.', 'warn');
      return [];
    }

    this.log('Fetching technology news from Google News...');
    
    const allArticles: RawArticleData[] = [];
    const topics = ['artificial intelligence', 'programming', 'cybersecurity'];

    // Fetch top headlines for technology
    try {
      const topHeadlines = await this.fetchTopHeadlines();
      allArticles.push(...topHeadlines);
      this.log(`Fetched ${topHeadlines.length} top headlines`);
    } catch (error) {
      this.log(`Failed to fetch top headlines: ${error}`, 'warn');
    }

    // Fetch specific topics (limited to save API quota)
    for (const topic of topics.slice(0, 2)) {
      try {
        const articles = await this.fetchTopic(topic);
        allArticles.push(...articles);
        this.log(`Fetched ${articles.length} articles for "${topic}"`);
      } catch (error) {
        this.log(`Failed to fetch "${topic}": ${error}`, 'warn');
      }
    }

    // Deduplicate by URL
    const uniqueArticles = this.deduplicateByUrl(allArticles);
    
    this.log(`Total: ${uniqueArticles.length} unique articles`);
    return uniqueArticles.slice(0, PROVIDER_CONFIG.MAX_ARTICLES_PER_FETCH);
  }

  /**
   * Fetch top headlines in technology category
   */
  private async fetchTopHeadlines(): Promise<RawArticleData[]> {
    const url = new URL(`${this.baseUrl}/top-headlines`);
    url.searchParams.set('category', 'technology');
    url.searchParams.set('lang', 'en');
    url.searchParams.set('max', '10');
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
