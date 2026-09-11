import { getEnv } from '@/lib/validation/env';
import { log } from '@/lib/logging/logger';
import { runIngestOnly, runPipelineCycle, runProcessBatch, runPublishDrip } from '@/lib/pipeline/worker-orchestrator.service';

function getArgValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return undefined;
  }
  return process.argv[index + 1];
}

async function executeCycle() {
  const mode = getArgValue('--mode') ?? 'full';
  const maxPublishRaw = getArgValue('--max-publish');
  const maxPublish = maxPublishRaw !== undefined ? Number(maxPublishRaw) : undefined;

  try {
    let result: unknown;

    if (mode === 'ingest') {
      result = await runIngestOnly();
    } else if (mode === 'process') {
      result = await runProcessBatch();
    } else if (mode === 'publish') {
      result = await runPublishDrip(
        maxPublish !== undefined && Number.isFinite(maxPublish) && maxPublish > 0 ? maxPublish : undefined,
      );
    } else {
      result = await runPipelineCycle();
    }

    log({
      level: 'INFO',
      message: 'Worker cycle finished',
      context: { mode, ...(typeof result === 'object' && result !== null ? result : { result }) },
    });
  } catch (error) {
    log({
      level: 'ERROR',
      message: 'Worker cycle failed',
      context: {
        error: error instanceof Error ? error.message : 'Unknown worker error',
      },
    });
  }
}

async function main() {
  const env = getEnv();
  const runOnce = process.argv.includes('--run-once');

  await executeCycle();

  if (runOnce) {
    return;
  }

  const intervalMs = env.WORKER_INTERVAL_MINUTES * 60_000;
  log({
    level: 'INFO',
    message: 'Worker scheduler armed',
    context: { everyMinutes: env.WORKER_INTERVAL_MINUTES },
  });

  setInterval(() => {
    void executeCycle();
  }, intervalMs);
}

void main();
