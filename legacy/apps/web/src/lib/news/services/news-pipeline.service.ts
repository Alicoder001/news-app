import { getBackendBaseUrl } from '@/lib/api/backend-client';

async function triggerJob(job: 'sync-news' | 'process-raw', payload?: Record<string, unknown>) {
  const token = process.env.API_INTERNAL_TOKEN;
  if (!token) {
    throw new Error('API_INTERNAL_TOKEN is required for pipeline job triggering');
  }

  const response = await fetch(`${getBackendBaseUrl()}/v1/internal/jobs/trigger`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-token': token,
    },
    body: JSON.stringify({
      job,
      payload: payload ?? {},
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Pipeline trigger failed: ${response.status}`);
  }

  return response.json();
}

export class NewsPipeline {
  static async run(_limit?: number): Promise<{
    processed: number;
    skipped: number;
    errors: number;
  }> {
    await triggerJob('sync-news', { source: 'legacy-news-pipeline-run' });
    await triggerJob('process-raw', { source: 'legacy-news-pipeline-run' });

    return {
      processed: 0,
      skipped: 0,
      errors: 0,
    };
  }

  static async processOne(rawArticleId: string): Promise<void> {
    await triggerJob('process-raw', {
      source: 'legacy-news-pipeline-single',
      rawArticleId,
    });
  }
}
