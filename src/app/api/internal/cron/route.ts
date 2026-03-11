import { runPipelineCycle } from '@/lib/pipeline/worker-orchestrator.service';
import { withRouteHandler } from '@/lib/api/response';
import { UnauthorizedError } from '@/lib/errors/domain';
import { getEnv } from '@/lib/validation/env';

export async function POST(request: Request) {
  return withRouteHandler(async () => {
    const env = getEnv();
    const authHeader = request.headers.get('authorization');

    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      throw new UnauthorizedError('Invalid cron secret');
    }

    return runPipelineCycle();
  });
}
