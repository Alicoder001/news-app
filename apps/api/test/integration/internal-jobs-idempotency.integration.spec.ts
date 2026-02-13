import { ConfigService } from '@nestjs/config';
import { describe, expect, it, jest } from '@jest/globals';

import { InternalJobsService } from '../../src/modules/operations/application/services/internal-jobs.service';

const addMock = jest.fn<(...args: unknown[]) => Promise<{ id: string }>>();

jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: addMock,
  })),
}));

describe('InternalJobsService idempotency', () => {
  it('passes idempotency key as BullMQ jobId for replay safety', async () => {
    addMock.mockResolvedValue({ id: 'replay-key-1' });

    const configService = {
      get: jest.fn().mockImplementation((key: unknown) => {
        if (key === 'infrastructure.redisUrl') {
          return 'redis://localhost:6379';
        }
        return undefined;
      }),
    } as unknown as ConfigService;

    const service = new InternalJobsService(configService);
    const result = await service.trigger('process-raw', {
      idempotencyKey: 'replay-key-1',
      source: 'test',
    });

    expect(addMock).toHaveBeenCalledWith(
      'process-raw',
      expect.objectContaining({
        idempotencyKey: 'replay-key-1',
      }),
      expect.objectContaining({
        jobId: 'replay-key-1',
      }),
    );
    expect(result.queued).toBe(true);
    expect(result.jobId).toBe('replay-key-1');
  });
});
