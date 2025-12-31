export interface RawArticleData {
  externalId?: string;
  title: string;
  description?: string;
  content?: string;
  url: string;
  publishedAt?: Date;
  sourceId: string;
}

export interface NewsProvider {
  name: string;
  fetchArticles(): Promise<RawArticleData[]>;
}
