import { NewsProvider, RawArticleData } from '../types';

export class NewsApiProvider implements NewsProvider {
  name = 'NewsAPI';
  private apiKey = process.env.NEWS_API_KEY;

  async fetchArticles(): Promise<RawArticleData[]> {
    if (!this.apiKey) {
      console.error('NewsAPI Key missing');
      return [];
    }

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=technology&language=en&sortBy=publishedAt&apiKey=${this.apiKey}`
    );

    if (!response.ok) {
      console.error('Failed to fetch from NewsAPI', await response.text());
      return [];
    }

    const data = await response.json();
    
    // In a real app, you'd map sourceId dynamically
    const sourceId = "temp_news_api_id"; 

    return data.articles.map((art: any) => ({
      externalId: art.url,
      title: art.title,
      description: art.description,
      content: art.content,
      url: art.url,
      publishedAt: new Date(art.publishedAt),
      sourceId: sourceId
    }));
  }
}
