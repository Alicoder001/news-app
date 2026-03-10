import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { describe, expect, it, jest } from '@jest/globals';

import { InternalJobsService } from '../../src/modules/operations/application/services/internal-jobs.service';

describe('InternalJobsService integration', () => {
  it('returns dry-run mode when REDIS_URL is missing', async () => {
    const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);

    const configService = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as ConfigService;

    const service = new InternalJobsService(configService);
    const result = await service.trigger('sync-news', { idempotencyKey: 'dryrun-1' });

    expect(result.queued).toBe(false);
    expect(result.mode).toBe('dry-run');
    expect(result.job).toBe('sync-news');
    expect(warnSpy).toHaveBeenCalledWith(
      'REDIS_URL is missing. Internal job "sync-news" executed in dry-run mode.',
    );

    warnSpy.mockRestore();
  });
});
