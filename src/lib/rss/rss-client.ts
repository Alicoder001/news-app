import Parser from 'rss-parser';

export const rssClient = new Parser({
  timeout: 10_000,
  headers: {
    'User-Agent': 'ai_shunos/0.1 RSS Ingestion Bot',
  },
});
