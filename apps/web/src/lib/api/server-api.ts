import { getBackendBaseUrl, getInternalBridgeHeaders } from './backend-client';

type JsonRecord = Record<string, unknown>;

async function backendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export async function getArticles(params: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  sort?: 'latest' | 'trending';
  days?: number;
  includeRawSource?: boolean;
}) {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.category) search.set('category', params.category);
  if (params.tag) search.set('tag', params.tag);
  if (params.sort) search.set('sort', params.sort);
  if (params.days) search.set('days', String(params.days));
  if (params.includeRawSource) search.set('includeRawSource', 'true');
  const query = search.toString();

  return backendFetch<{ success: boolean; data: JsonRecord }>(
    `/v1/articles${query ? `?${query}` : ''}`,
  );
}

export function getArticleBySlug(slug: string) {
  return backendFetch<{ success: boolean; data: JsonRecord }>(`/v1/articles/${slug}`);
}

export function getFeaturedArticles(limit = 5) {
  return backendFetch<{ success: boolean; data: JsonRecord }>(
    `/v1/articles/featured?limit=${limit}`,
  );
}

export function getArticleSlugs(limit = 1000) {
  return backendFetch<{ success: boolean; data: JsonRecord }>(
    `/v1/articles/slugs?limit=${limit}`,
  );
}

export function getCategories() {
  return backendFetch<{ success: boolean; data: JsonRecord }>('/v1/categories');
}

export function getTopCategories(limit = 8) {
  return backendFetch<{ success: boolean; data: JsonRecord }>(
    `/v1/categories/top?limit=${limit}`,
  );
}

export function getCategoryBySlug(slug: string) {
  return backendFetch<{ success: boolean; data: JsonRecord }>(`/v1/categories/${slug}`);
}

export function getTagBySlug(slug: string) {
  return backendFetch<{ success: boolean; data: JsonRecord }>(`/v1/tags/${slug}`);
}

function getAdminHeaders() {
  return getInternalBridgeHeaders();
}

export function getAdminOverview() {
  return backendFetch<{ success: boolean; data: JsonRecord }>('/v1/admin/overview', {
    headers: getAdminHeaders(),
  });
}

export function getAdminArticles(page = 1, limit = 20) {
  return backendFetch<{ success: boolean; data: JsonRecord }>(
    `/v1/admin/articles?page=${page}&limit=${limit}`,
    { headers: getAdminHeaders() },
  );
}

export function getAdminArticleById(id: string) {
  return backendFetch<{ success: boolean; data: JsonRecord }>(`/v1/admin/articles/${id}`, {
    headers: getAdminHeaders(),
  });
}

export function getAdminSources() {
  return backendFetch<{ success: boolean; data: JsonRecord }>('/v1/admin/sources', {
    headers: getAdminHeaders(),
  });
}

export function getAdminPipelineRuns(limit = 50) {
  return backendFetch<{ success: boolean; data: JsonRecord }>(
    `/v1/admin/pipeline/runs?limit=${limit}`,
    {
      headers: getAdminHeaders(),
    },
  );
}

export function getAdminUsageSummary(days = 30) {
  return backendFetch<{ success: boolean; data: JsonRecord }>(
    `/v1/admin/usage/summary?days=${days}`,
    {
      headers: getAdminHeaders(),
    },
  );
}

export function getAdminUsageRecent(limit = 20) {
  return backendFetch<{ success: boolean; data: JsonRecord }>(
    `/v1/admin/usage/recent?limit=${limit}`,
    {
      headers: getAdminHeaders(),
    },
  );
}

export function getAdminSettings() {
  return backendFetch<{ success: boolean; data: JsonRecord }>('/v1/admin/settings', {
    headers: getAdminHeaders(),
  });
}

export async function trackInternalUsage(payload: Record<string, unknown>) {
  const token = process.env.API_INTERNAL_TOKEN;
  if (!token) {
    return;
  }

  await backendFetch('/v1/internal/usage/track', {
    method: 'POST',
    headers: {
      'x-internal-token': token,
    },
    body: JSON.stringify(payload),
  });
}
