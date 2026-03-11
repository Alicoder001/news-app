import { listPipelineRuns } from '@/lib/pipeline/run.service';
import { PipelineRunsPanel } from '@/components/admin/pipeline-runs-panel';

export default async function AdminPipelinePage() {
  const runs = await listPipelineRuns();

  return (
    <main>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Pipeline Runs</h1>
      <PipelineRunsPanel initialRuns={runs} />
    </main>
  );
}
