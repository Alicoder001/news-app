import { getBackendBaseUrl, getInternalBridgeHeaders } from '@/lib/api/backend-client';

export type SourceType = 'NEWS_API' | 'RSS' | 'SCRAPER';

interface SourceRow {
  id: string;
  name: string;
  url: string;
  type: SourceType;
  isActive: boolean;
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...getInternalBridgeHeaders(),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Source repository request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export class NewsSourceRepository {
  static async getOrCreate(
    name: string,
    url: string,
    type: SourceType = 'NEWS_API',
  ): Promise<{ id: string; isNew: boolean }> {
    const existing = await this.getActive();
    const found = existing.find((source) => source.url === url);
    if (found) {
      return { id: found.id, isNew: false };
    }

    const created = await adminFetch<{ data?: SourceRow }>('/v1/admin/sources', {
      method: 'POST',
      body: JSON.stringify({ name, url, type, isActive: true }),
    });

    if (!created.data?.id) {
      throw new Error('Failed to create source');
    }

    return { id: created.data.id, isNew: true };
  }

  static async updateLastFetched(_id: string): Promise<void> {
    // Last fetched is maintained by backend ingestion jobs.
  }

  static async getActive(): Promise<{ id: string; name: string; url: string; type: SourceType }[]> {
    const response = await adminFetch<{ data?: { sources?: SourceRow[] } }>('/v1/admin/sources');
    const sources = response.data?.sources ?? [];
    return sources
      .filter((source) => source.isActive)
      .map((source) => ({
        id: source.id,
        name: source.name,
        url: source.url,
        type: source.type,
      }));
  }

  static async getByType(type: SourceType): Promise<{ id: string; name: string; url: string }[]> {
    const sources = await this.getActive();
    return sources
      .filter((source) => source.type === type)
      .map((source) => ({
        id: source.id,
        name: source.name,
        url: source.url,
      }));
  }

  static async deactivate(id: string): Promise<void> {
    await adminFetch(`/v1/admin/sources/${id}`, {
      method: 'PATCH',
    });
  }

  static async getStats(): Promise<{
    total: number;
    active: number;
    byType: Record<string, number>;
  }> {
    const response = await adminFetch<{ data?: { sources?: SourceRow[] } }>('/v1/admin/sources');
    const sources = response.data?.sources ?? [];
    const byType: Record<string, number> = {};

    for (const source of sources) {
      byType[source.type] = (byType[source.type] ?? 0) + 1;
    }

    return {
      total: sources.length,
      active: sources.filter((source) => source.isActive).length,
      byType,
    };
  }
}
