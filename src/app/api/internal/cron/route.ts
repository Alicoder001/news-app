import { runIngestOnly, runPipelineCycle, runProcessBatch, runPublishDrip } from '@/lib/pipeline/worker-orchestrator.service';
import { withRouteHandler } from '@/lib/api/response';
import { UnauthorizedError, ValidationError } from '@/lib/errors/domain';
import { getEnv } from '@/lib/validation/env';

export async function POST(request: Request) {
  return withRouteHandler(async () => {
    const env = getEnv();
    const authHeader = request.headers.get('authorization');

    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      throw new UnauthorizedError('Invalid cron secret');
    }

    const url = new URL(request.url);
    const mode = url.searchParams.get('mode') ?? 'full';

    if (mode === 'ingest') {
      return runIngestOnly();
    }

    if (mode === 'process') {
      return runProcessBatch();
    }

    if (mode === 'publish') {
      const maxRaw = url.searchParams.get('maxPerRun');
      const maxPerRun = maxRaw !== null ? Number(maxRaw) : undefined;
      return runPublishDrip(Number.isFinite(maxPerRun) && (maxPerRun as number) > 0 ? maxPerRun : undefined);
    }

    if (mode === 'full') {
      return runPipelineCycle();
    }

    throw new ValidationError(`Invalid mode: ${mode}. Valid modes: ingest, process, publish, full`);
  });
}
