import { BaseNewsProvider, PROVIDER_CONFIG } from './base.provider';
import { RawArticleData } from '../types';

/**
 * NewsAPI.ai Response Types
 * @see https://newsapi.ai/documentation
 * 
 * NewsAPI.ai (Event Registry) Features:
 * - Free tier: 2000 searches, 200,000 articles, 30 days history
 * - FULL article body with articleBodyLen=-1
 * - Advanced query builder
 * - Technology category filtering
 * - Sentiment analysis included
 */
interface NewsAPIAiArticle {
  uri: string;
  lang: string;
  isDuplicate: boolean;
  date: string;
  time: string;
  dateTime: string;
  dateTimePub: string;
  dataType: string;
  sim: number;
  url: string;
  title: string;
  body: string;  // Full article body when articleBodyLen=-1
  source: {
    uri: string;
    dataType: string;
    title: string;
  };
  authors: Array<{ uri: string; name: string; type: string }>;
  image: string | null;
  eventUri: string | null;
  sentiment: number | null;
  wgt: number;
  relevance: number;
}

interface NewsAPIAiResponse {
  articles: {
    results: NewsAPIAiArticle[];
    totalResults: number;
    page: number;
    count: number;
    pages: number;
  };
}

/**
 * NewsAPI.ai (Event Registry) Provider
 * 
 * Features:
 * - Free tier: 2000 searches/month, 200K articles, 30 days history
 * - FULL article body (not truncated!) with articleBodyLen=-1
 * - Technology category support
 * - Advanced query builder with AND/OR/NOT
 * - Sentiment analysis
 * - 150,000+ news sources worldwide
 * 
 * @see https://newsapi.ai/documentation
 * @author Aishunos Team
 * @version 1.0.0
 */
export class NewsAPIAiProvider extends BaseNewsProvider {
  name = 'NewsAPI.ai';
  
  private baseUrl = 'https://eventregistry.org/api/v1';

  /**
   * Get API key dynamically
   */
  private get apiKey(): string | undefined {
    return process.env.NEWSAPI_AI_KEY;
  }

  /**
   * Check if API is available
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  /**
   * Fetch articles from NewsAPI.ai
   */
  async fetchArticles(): Promise<RawArticleData[]> {
    const currentKey = this.apiKey;
    
    if (!currentKey) {
      this.log('NEWSAPI_AI_KEY not found. Skipping NewsAPI.ai fetch.', 'warn');
      return [];
    }

    this.log('Fetching technology news from NewsAPI.ai (Event Registry)...');
    
    try {
      const articles = await this.fetchTechNews();
      this.log(`Fetched ${articles.length} articles with FULL content from NewsAPI.ai`);
      return articles.slice(0, PROVIDER_CONFIG.MAX_ARTICLES_PER_FETCH);
    } catch (error) {
      this.log(`Failed to fetch from NewsAPI.ai: ${error}`, 'error');
      return [];
    }
  }

  /**
   * Fetch technology news using getArticles endpoint
   * Uses POST for complex queries
   */
  private async fetchTechNews(): Promise<RawArticleData[]> {
    const url = `${this.baseUrl}/article/getArticles`;
    
    // Build query body for POST request
    const queryBody = {
      action: 'getArticles',
      keyword: 'technology OR artificial intelligence OR software OR programming OR cybersecurity',
      keywordOper: 'or',
      lang: 'eng',
      articlesSortBy: 'date',
      articlesSortByAsc: false,
      articlesCount: 10,
      articleBodyLen: -1,  // FULL article body!
      resultType: 'articles',
      dataType: ['news'],
      apiKey: this.apiKey,
    };

    return this.fetchFromEndpoint(url, queryBody);
  }

  /**
   * Fetch from NewsAPI.ai endpoint using POST
   */
  private async fetchFromEndpoint(
    url: string,
    body: Record<string, unknown>
  ): Promise<RawArticleData[]> {
    const response = await this.safeFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NewsAPI.ai error: ${response.status} - ${errorText}`);
    }

    const data: NewsAPIAiResponse = await response.json();

    if (!data.articles?.results || data.articles.results.length === 0) {
      this.log('No articles found from NewsAPI.ai');
      return [];
    }

    // Get or create source
    const sourceId = await this.getOrCreateSource(
      'https://newsapi.ai',
      'NEWS_API'
    );

    return data.articles.results
      .filter(this.isValidArticle)
      .map((article) => ({
        externalId: article.uri,
        title: article.title,
        description: article.body?.slice(0, 300) || undefined,  // First 300 chars as description
        content: article.body || undefined,  // FULL article body!
        url: article.url,
        imageUrl: article.image || undefined,
        publishedAt: new Date(article.dateTimePub || article.dateTime),
        sourceId,
      }));
  }

  /**
   * Validate article has required fields
   */
  private isValidArticle(article: NewsAPIAiArticle): boolean {
    return !!(
      article.title &&
      article.url &&
      article.uri &&
      !article.isDuplicate &&
      article.title !== '[Removed]' &&
      !article.title.toLowerCase().includes('[removed]')
    );
  }
}
