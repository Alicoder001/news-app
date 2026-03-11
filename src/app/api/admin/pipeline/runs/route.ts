import { createPipelineRun, listPipelineRuns } from '@/lib/pipeline/run.service';
import { ok, withRouteHandler } from '@/lib/api/response';

export async function GET() {
  return withRouteHandler(async () => listPipelineRuns());
}

export async function POST() {
  return withRouteHandler(async () => ok(await createPipelineRun(), 201));
}
