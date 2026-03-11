import { PipelineRunStatus } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { ConflictError } from '@/lib/errors/domain';

const PIPELINE_LOCK_KEY = 'global-pipeline-lock';
const DEFAULT_LOCK_MINUTES = 25;

export async function listPipelineRuns() {
  return prisma.pipelineRun.findMany({
    orderBy: { startedAt: 'desc' },
    include: {
      events: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });
}

export async function createPipelineRun() {
  return prisma.pipelineRun.create({
    data: {
      status: PipelineRunStatus.RUNNING,
    },
  });
}

export async function acquirePipelineLock(runId: string, lockMinutes = DEFAULT_LOCK_MINUTES) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + lockMinutes * 60_000);

  const current = await prisma.pipelineLock.findUnique({
    where: { key: PIPELINE_LOCK_KEY },
  });

  if (current && current.expiresAt > now) {
    throw new ConflictError('Pipeline is already running');
  }

  return prisma.pipelineLock.upsert({
    where: { key: PIPELINE_LOCK_KEY },
    update: {
      runId,
      lockedAt: now,
      expiresAt,
    },
    create: {
      key: PIPELINE_LOCK_KEY,
      runId,
      lockedAt: now,
      expiresAt,
    },
  });
}

export async function releasePipelineLock(runId: string) {
  await prisma.pipelineLock.deleteMany({
    where: {
      key: PIPELINE_LOCK_KEY,
      runId,
    },
  });
}
