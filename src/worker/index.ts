import { getEnv } from '@/lib/validation/env';
import { log } from '@/lib/logging/logger';
import { runPipelineCycle } from '@/lib/pipeline/worker-orchestrator.service';

async function executeCycle() {
  try {
    const result = await runPipelineCycle();
    log({
      level: 'INFO',
      message: 'Worker cycle finished',
      context: result,
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
