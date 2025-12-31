import Parser from 'rss-parser';
import { BaseNewsProvider, PROVIDER_CONFIG } from './base.provider';
import { RawArticleData } from '../types';

/**
 * RSS Feed Configuration
 */
interface RSSFeedConfig {
  name: string;
  url: string;
  category?: string;
}

/**
 * Google News RSS Feeds for IT/Technology
 * 
 * Google News provides high-quality, curated news from trusted sources.
 * RSS format: https://news.google.com/rss/topics/[TOPIC_ID]?hl=en-US&gl=US&ceid=US:en
 */
const DEFAULT_RSS_FEEDS: RSSFeedConfig[] = [
  // Google News - Technology
  {
    name: 'Google News - Technology',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'technology',
  },
  // Google News - AI & Machine Learning
  {
    name: 'Google News - AI',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+OR+machine+learning&hl=en-US&gl=US&ceid=US:en',
    category: 'ai',
  },
  // Google News - Programming
  {
    name: 'Google News - Programming',
    url: 'https://news.google.com/rss/search?q=programming+OR+software+development&hl=en-US&gl=US&ceid=US:en',
    category: 'programming',
  },
  // Google News - Cybersecurity
  {
    name: 'Google News - Cybersecurity',
    url: 'https://news.google.com/rss/search?q=cybersecurity+OR+hacking&hl=en-US&gl=US&ceid=US:en',
    category: 'security',
  },
  // Google News - Startups
  {
    name: 'Google News - Startups',
    url: 'https://news.google.com/rss/search?q=tech+startup+OR+venture+capital&hl=en-US&gl=US&ceid=US:en',
    category: 'startup',
  },
];

/**
 * RSS Feed Provider
 * 
 * Fetches articles from multiple RSS feeds.
 * Supports TechCrunch, Hacker News, The Verge, and more.
 * 
 * @author Antigravity Team
 * @version 1.0.0
 */
export class RSSProvider extends BaseNewsProvider {
  name = 'RSS';
  
  private parser: Parser;
  private feeds: RSSFeedConfig[];

  constructor(feeds: RSSFeedConfig[] = DEFAULT_RSS_FEEDS) {
    super();
    this.parser = new Parser({
      timeout: PROVIDER_CONFIG.FETCH_TIMEOUT_MS,
      headers: {
        'User-Agent': 'Antigravity News Bot/1.0',
      },
    });
    this.feeds = feeds;
  }

  /**
   * Fetch articles from all configured RSS feeds
   */
  async fetchArticles(): Promise<RawArticleData[]> {
    this.log(`Fetching from ${this.feeds.length} RSS feeds...`);
    
    const allArticles: RawArticleData[] = [];

    for (const feed of this.feeds) {
      try {
        const articles = await this.fetchFeed(feed);
        allArticles.push(...articles);
        this.log(`Fetched ${articles.length} articles from ${feed.name}`);
      } catch (error) {
        this.log(`Failed to fetch ${feed.name}: ${error}`, 'warn');
        // Continue with other feeds
      }
    }

    this.log(`Total: ${allArticles.length} articles from RSS feeds`);
    return allArticles.slice(0, PROVIDER_CONFIG.MAX_ARTICLES_PER_FETCH * this.feeds.length);
  }

  /**
   * Fetch articles from a single RSS feed
   */
  private async fetchFeed(feed: RSSFeedConfig): Promise<RawArticleData[]> {
    const parsed = await this.parser.parseURL(feed.url);
    const sourceId = await this.getOrCreateSource(feed.url, 'RSS');

    return parsed.items
      .slice(0, PROVIDER_CONFIG.MAX_ARTICLES_PER_FETCH)
      .map((item) => ({
        externalId: item.guid || item.link || undefined,
        title: this.cleanTitle(item.title || 'No title'),
        description: this.cleanDescription(item.contentSnippet || item.content || ''),
        content: item.content || item.contentSnippet || undefined,
        url: item.link || '',
        publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
        sourceId,
      }))
      .filter((article) => article.url); // Filter out articles without URL
  }

  /**
   * Clean article title (remove HTML, trim)
   */
  private cleanTitle(title: string): string {
    return title
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim()
      .slice(0, 500);          // Limit length
  }

  /**
   * Clean description (remove HTML, trim)
   */
  private cleanDescription(desc: string): string {
    return desc
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1000);
  }

  /**
   * Add a new feed dynamically
   */
  addFeed(feed: RSSFeedConfig): void {
    this.feeds.push(feed);
    this.log(`Added feed: ${feed.name} (${feed.url})`);
  }

  /**
   * Get current feed list
   */
  getFeeds(): RSSFeedConfig[] {
    return [...this.feeds];
  }
}
