import { LogLevel, PipelineStage, Prisma } from '@prisma/client';
import { prisma as prismaClient } from '@/lib/db/prisma';
import { log } from '@/lib/logging/logger';

type EventInput = {
  pipelineRunId: string;
  stage: keyof typeof PipelineStage | PipelineStage;
  level: keyof typeof LogLevel | LogLevel;
  message: string;
  meta?: Prisma.InputJsonValue;
};

export async function createPipelineEvent(input: EventInput) {
  const event = await prismaClient.pipelineEvent.create({
    data: {
      pipelineRunId: input.pipelineRunId,
      stage: input.stage as PipelineStage,
      level: input.level as LogLevel,
      message: input.message,
      meta: input.meta,
    },
  });

  log({
    level: input.level as 'INFO' | 'WARN' | 'ERROR',
    message: input.message,
    context: {
      pipelineRunId: input.pipelineRunId,
      stage: input.stage,
      meta: input.meta,
    },
  });

  return event;
}
