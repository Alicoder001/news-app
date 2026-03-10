import { getBackendBaseUrl } from '@/lib/api/backend-client';
import { RawArticleData } from '../types';

interface TriggerResponse {
  accepted?: boolean;
}

async function triggerInternalJob(job: 'sync-news' | 'process-raw'): Promise<void> {
  const token = process.env.API_INTERNAL_TOKEN;
  if (!token) {
    return;
  }

  const response = await fetch(`${getBackendBaseUrl()}/v1/internal/jobs/trigger`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-token': token,
    },
    body: JSON.stringify({
      job,
      payload: {
        source: 'legacy-web-adapter',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to trigger internal job: ${response.status}`);
  }

  await response.json() as TriggerResponse;
}

export class RawArticleRepository {
  static async exists(_url: string) {
    return false;
  }

  static async createMany(articles: RawArticleData[]) {
    if (articles.length > 0) {
      await triggerInternalJob('sync-news');
    }
    return 0;
  }

  static async getUnprocessed(_limit: number = 10) {
    return [];
  }

  static async markAsProcessed(_id: string) {
    await triggerInternalJob('process-raw');
    return { success: true };
  }
}
