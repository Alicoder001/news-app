import type {
  CanonicalArticleDetailPayload,
  CanonicalArticleListPayload,
  CanonicalCategoriesPayload,
  CanonicalFeaturedPayload,
  CanonicalResponse,
} from '@news-app/api-types';

export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
}

export interface ListArticlesParams {
  page?: number;
  limit?: number;
  category?: string;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(
  baseUrl: string,
  endpoint: string,
  options: RequestOptions = {},
  defaultHeaders?: Record<string, string>,
): Promise<T> {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(defaultHeaders ?? {}),
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export function createApiClient(config: ApiClientConfig) {
  return {
    articles: {
      list(params: ListArticlesParams = {}) {
        const query = toQuery({
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          category: params.category,
        });

        return request<CanonicalResponse<CanonicalArticleListPayload>>(
          config.baseUrl,
          `/v1/articles${query}`,
          {},
          config.defaultHeaders,
        );
      },

      getBySlug(slug: string) {
        return request<CanonicalResponse<CanonicalArticleDetailPayload>>(
          config.baseUrl,
          `/v1/articles/${slug}`,
          {},
          config.defaultHeaders,
        );
      },

      featured(limit = 5) {
        const query = toQuery({ limit });
        return request<CanonicalResponse<CanonicalFeaturedPayload>>(
          config.baseUrl,
          `/v1/articles/featured${query}`,
          {},
          config.defaultHeaders,
        );
      },

      view(slug: string) {
        return request<CanonicalResponse<{ slug: string }>>(
          config.baseUrl,
          '/v1/articles/view',
          {
            method: 'POST',
            body: { slug },
          },
          config.defaultHeaders,
        );
      },
    },

    categories: {
      list() {
        return request<CanonicalResponse<CanonicalCategoriesPayload>>(
          config.baseUrl,
          '/v1/categories',
          {},
          config.defaultHeaders,
        );
      },
    },
  };
}
