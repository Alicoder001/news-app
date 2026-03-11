export type CollectorOutput = {
  status: 'ok' | 'skip';
  skipReason?: string | null;
  normalizedArticle?: {
    title: string;
    summary: string;
    content: string;
    canonicalUrl: string;
    sourceName: string;
    sourceUrl: string;
    publishedAt: string | null;
    keywords: string[];
  };
};

export type WriterOutput = {
  status: 'ok' | 'skip' | 'hold';
  decisionReason?: string | null;
  article?: {
    title: string;
    slug: string;
    category: string;
    tags: string[];
    shortPost: string;
    shortSummary: string;
    fullArticle: string;
    confidence: number;
    sources: Array<{ name: string; url: string }>;
  };
};

export type ReviewerOutput = {
  decision: 'APPROVE' | 'REJECT' | 'HOLD';
  reason: string;
  issues: string[];
  publishReady: boolean;
};
