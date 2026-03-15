import type { RssSourceInput } from './types';

export const DEFAULT_RSS_SOURCES: RssSourceInput[] = [
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss/', isActive: false },
  { name: 'NVIDIA Developer Blog', url: 'https://developer.nvidia.com/blog/feed' },
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
