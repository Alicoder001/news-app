# News Providers

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Maqsad

News Providers tashqi manbalardan yangiliklar olish uchun adapterlar to'plami.

---

## Fayl Joylashuvi

\\\
apps/web/src/lib/news/providers/
├── base.provider.ts      # Abstract base class
├── rss.provider.ts       # RSS/Atom feeds
├── gnews.provider.ts     # GNews API
├── newsapi.provider.ts   # NewsAPI.org
├── newsapi-ai.provider.ts # NewsAPI.ai
└── thenewsapi.provider.ts # TheNewsAPI
\\\

---

## Provider Interface

\\\	ypescript
interface NewsProvider {
  name: string;
  
  // Manbadan yangiliklar olish
  fetch(source: NewsSource): Promise<RawArticle[]>;
  
  // Provider sog'ligini tekshirish
  healthCheck(): Promise<boolean>;
  
  // Rate limit holatini olish
  getRateLimitStatus(): RateLimitStatus;
}

interface RateLimitStatus {
  remaining: number;
  limit: number;
  resetAt: Date;
}
\\\

---

## Mavjud Providerlar

### 1. RSS Provider

**Tavsif:** RSS va Atom feedlarni parse qiladi.

\\\	ypescript
class RSSProvider extends BaseProvider {
  async fetch(source: NewsSource): Promise<RawArticle[]> {
    const feed = await parser.parseURL(source.feedUrl);
    return feed.items.map(item => ({
      title: item.title,
      url: item.link,
      description: item.contentSnippet,
      content: item.content,
      publishedAt: new Date(item.pubDate),
      author: item.creator,
      imageUrl: extractImage(item),
    }));
  }
}
\\\

**Afzalliklari:**
- ✅ Bepul
- ✅ Ko'p manbalar
- ✅ Rate limit yo'q

**Kamchiliklari:**
- ❌ To'liq kontent har doim mavjud emas
- ❌ Har xil formatlar

---

### 2. GNews Provider

**Tavsif:** GNews.io API orqali yangiliklar olish.

\\\	ypescript
class GNewsProvider extends BaseProvider {
  private baseUrl = 'https://gnews.io/api/v4';
  
  async fetch(source: NewsSource): Promise<RawArticle[]> {
    const response = await axios.get(\\/search\, {
      params: {
        q: source.query,
        lang: source.language,
        country: source.country,
        token: source.apiKey,
      }
    });
    return response.data.articles.map(this.mapArticle);
  }
}
\\\

**Rate Limits:**
| Plan | Requests/day | Articles/request |
|------|-------------|------------------|
| Free | 100 | 10 |
| Basic | 1000 | 100 |

---

### 3. NewsAPI Provider

**Tavsif:** NewsAPI.org orqali yangiliklar olish.

\\\	ypescript
class NewsAPIProvider extends BaseProvider {
  private baseUrl = 'https://newsapi.org/v2';
  
  async fetch(source: NewsSource): Promise<RawArticle[]> {
    const response = await axios.get(\\/everything\, {
      params: {
        q: source.query,
        language: source.language,
        sortBy: 'publishedAt',
        apiKey: source.apiKey,
      }
    });
    return response.data.articles.map(this.mapArticle);
  }
}
\\\

**Rate Limits:**
| Plan | Requests/day |
|------|-------------|
| Developer | 100 |
| Business | 250,000 |

---

### 4. TheNewsAPI Provider

**Tavsif:** TheNewsAPI.com orqali yangiliklar olish.

\\\	ypescript
class TheNewsAPIProvider extends BaseProvider {
  private baseUrl = 'https://api.thenewsapi.com/v1';
  
  async fetch(source: NewsSource): Promise<RawArticle[]> {
    const response = await axios.get(\\/news/all\, {
      params: {
        language: source.language,
        categories: source.category,
        api_token: source.apiKey,
      }
    });
    return response.data.data.map(this.mapArticle);
  }
}
\\\

---

### 5. NewsAPI.ai Provider

**Tavsif:** NewsAPI.ai orqali yangiliklar olish (AI-powered).

\\\	ypescript
class NewsAPIAIProvider extends BaseProvider {
  private baseUrl = 'https://eventregistry.org/api/v1';
  
  async fetch(source: NewsSource): Promise<RawArticle[]> {
    const response = await axios.post(\\/article/getArticles\, {
      query: {
        keyword: source.query,
        lang: source.language,
      },
      apiKey: source.apiKey,
    });
    return response.data.articles.results.map(this.mapArticle);
  }
}
\\\

---

## Provider Factory

\\\	ypescript
function getProvider(type: string): NewsProvider {
  switch (type) {
    case 'rss':
      return new RSSProvider();
    case 'gnews':
      return new GNewsProvider();
    case 'newsapi':
      return new NewsAPIProvider();
    case 'thenewsapi':
      return new TheNewsAPIProvider();
    case 'newsapi-ai':
      return new NewsAPIAIProvider();
    default:
      throw new Error(\Unknown provider: \\);
  }
}
\\\

---

## Error Handling

\\\	ypescript
class ProviderError extends Error {
  constructor(
    public provider: string,
    public code: string,
    message: string,
    public retryable: boolean = false
  ) {
    super(message);
  }
}

// Common errors
const ERRORS = {
  RATE_LIMIT: { code: 'RATE_LIMIT', retryable: true },
  AUTH_FAILED: { code: 'AUTH_FAILED', retryable: false },
  TIMEOUT: { code: 'TIMEOUT', retryable: true },
  PARSE_ERROR: { code: 'PARSE_ERROR', retryable: false },
};
\\\

---

## Environment Variables

\\\env
# GNews
GNEWS_API_KEY=...

# NewsAPI.org
NEWSAPI_API_KEY=...

# TheNewsAPI
THENEWSAPI_API_KEY=...

# NewsAPI.ai
NEWSAPI_AI_KEY=...
\\\

---

## Bog'liq Hujjatlar

- [NewsSource Model](../models/NEWS_SOURCE.md) - Manba konfiguratsiyasi
- [News Pipeline](./NEWS_PIPELINE.md) - Provider integratsiyasi
