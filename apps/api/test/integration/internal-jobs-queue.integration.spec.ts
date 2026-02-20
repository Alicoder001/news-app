import { ConfigService } from '@nestjs/config';
import { describe, expect, it, jest } from '@jest/globals';

import { InternalJobsService } from '../../src/modules/operations/application/services/internal-jobs.service';

const addMock = jest.fn<(...args: unknown[]) => Promise<{ id: string }>>();

jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: addMock,
  })),
}));

describe('InternalJobsService queue mode', () => {
  it('queues telegram job and returns queue metadata', async () => {
    addMock.mockResolvedValue({ id: 'telegram-job-1' });

    const configService = {
      get: jest.fn().mockImplementation((key: unknown) => {
        if (key === 'infrastructure.redisUrl') {
          return 'redis://localhost:6379';
        }
        return undefined;
      }),
    } as unknown as ConfigService;

    const service = new InternalJobsService(configService);
    const result = await service.trigger('telegram-post', {
      source: 'integration-test',
    });

    expect(addMock).toHaveBeenCalledWith(
      'telegram-post',
      expect.objectContaining({
        source: 'integration-test',
      }),
      expect.objectContaining({
        attempts: 3,
        removeOnComplete: 50,
        removeOnFail: 100,
      }),
    );
    expect(result).toEqual({
      queued: true,
      mode: 'queue',
      job: 'telegram-post',
      jobId: 'telegram-job-1',
    });
  });
});
