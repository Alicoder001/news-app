import prisma from '@/lib/prisma';
import { NewsProvider, RawArticleData } from '../types';

/**
 * Abstract Base Provider for News Sources
 * 
 * Provides common functionality for all news providers:
 * - Source management (auto-create in database)
 * - Logging
 * - Error handling patterns
 * 
 * @author Antigravity Team
 * @version 1.0.0
 */
export abstract class BaseNewsProvider implements NewsProvider {
  abstract name: string;
  abstract fetchArticles(): Promise<RawArticleData[]>;

  /**
   * Logging helper with provider name prefix
   */
  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const prefix = `[${this.name}]`;
    switch (level) {
      case 'error':
        console.error(`❌ ${prefix} ${message}`);
        break;
      case 'warn':
        console.warn(`⚠️ ${prefix} ${message}`);
        break;
      default:
        console.log(`📰 ${prefix} ${message}`);
    }
  }

  /**
   * Get or create a news source in the database
   * Ensures idempotent source creation
   * 
   * @param url - Unique URL identifier for the source
   * @param type - Source type (NEWS_API, RSS, SCRAPER)
   */
  protected async getOrCreateSource(
    url: string,
    type: 'NEWS_API' | 'RSS' | 'SCRAPER' = 'NEWS_API'
  ): Promise<string> {
    try {
      // Try to find existing source
      let source = await prisma.newsSource.findUnique({
        where: { url },
      });

      // Create if not exists
      if (!source) {
        source = await prisma.newsSource.create({
          data: {
            name: this.name,
            url,
            type,
            isActive: true,
          },
        });
        this.log(`Created new source: ${url}`);
      }

      // Update last fetched time
      await prisma.newsSource.update({
        where: { id: source.id },
        data: { lastFetched: new Date() },
      });

      return source.id;
    } catch (error) {
      this.log(`Failed to get/create source: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * Safe fetch wrapper with timeout
   */
  protected async safeFetch(
    url: string,
    options: RequestInit = {},
    timeoutMs: number = 10000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeout);
    }
  }
}

/**
 * Configuration for news providers
 */
export const PROVIDER_CONFIG = {
  // Fetch settings
  FETCH_TIMEOUT_MS: 10000,
  MAX_ARTICLES_PER_FETCH: 20,
  
  // Rate limiting
  MIN_FETCH_INTERVAL_MS: 60000, // 1 minute between fetches
  
  // News categories to search
  CATEGORIES: [
    'artificial intelligence',
    'machine learning', 
    'programming',
    'cybersecurity',
    'blockchain',
    'startup',
    'mobile',
  ],
} as const;
