import type { RssSourceInput } from './types';

export const DEFAULT_RSS_SOURCES: RssSourceInput[] = [
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss/' },
  { name: 'Anthropic News', url: 'https://www.anthropic.com/news/rss' },
  { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml' },
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  },
];
