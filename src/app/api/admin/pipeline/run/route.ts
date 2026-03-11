import { runPipelineCycle } from '@/lib/pipeline/worker-orchestrator.service';
import { withRouteHandler } from '@/lib/api/response';

export async function POST() {
  return withRouteHandler(async () => runPipelineCycle());
}
