export type RssSourceInput = {
  name: string;
  url: string;
};

export type ParsedRssItem = {
  title: string;
  summary?: string | null;
  content?: string | null;
  canonicalUrl: string;
  imageUrl?: string | null;
  publishedAt?: string | null;
};
