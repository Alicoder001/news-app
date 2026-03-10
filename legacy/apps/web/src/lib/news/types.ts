export interface RawArticleData {
  externalId?: string;
  title: string;
  description?: string;
  content?: string;
  url: string;
  imageUrl?: string;  // Maqola rasmi
  publishedAt?: Date;
  sourceId: string;
}

export interface NewsProvider {
  name: string;
  fetchArticles(): Promise<RawArticleData[]>;
}
