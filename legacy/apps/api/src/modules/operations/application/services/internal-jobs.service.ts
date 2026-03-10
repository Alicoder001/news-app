import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JobsOptions, Queue } from 'bullmq';

type InternalJob = 'sync-news' | 'process-raw' | 'telegram-post';

interface TriggerResult {
  queued: boolean;
  mode: 'queue' | 'dry-run';
  job: InternalJob;
  jobId?: string;
}

interface TriggerPayload extends Record<string, unknown> {
  idempotencyKey?: string;
}

@Injectable()
export class InternalJobsService {
  private readonly logger = new Logger(InternalJobsService.name);
  private queue: Queue | null = null;

  constructor(private readonly configService: ConfigService) {}

  async trigger(job: InternalJob, payload: TriggerPayload = {}): Promise<TriggerResult> {
    const queue = this.getQueue();
    if (!queue) {
      this.logger.warn(`REDIS_URL is missing. Internal job "${job}" executed in dry-run mode.`);
      return {
        queued: false,
        mode: 'dry-run',
        job,
      };
    }

    const options: JobsOptions = {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5_000,
      },
      removeOnComplete: 50,
      removeOnFail: 100,
      jobId: payload.idempotencyKey,
    };

    const queuedJob = await queue.add(job, payload, options);
    return {
      queued: true,
      mode: 'queue',
      job,
      jobId: queuedJob.id?.toString(),
    };
  }

  private getQueue(): Queue | null {
    if (this.queue) {
      return this.queue;
    }

    const redisUrl = this.configService.get<string>('infrastructure.redisUrl');
    if (!redisUrl) {
      return null;
    }

    this.queue = new Queue('news-internal-jobs', {
      connection: {
        url: redisUrl,
        maxRetriesPerRequest: null,
      },
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    });

    return this.queue;
  }
}
