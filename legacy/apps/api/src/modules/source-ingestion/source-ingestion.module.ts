import { Module } from '@nestjs/common';

import { SourcesService } from './application/services/sources.service';
import { AdminSourcesController } from './presentation/controllers/admin-sources.controller';

@Module({
  providers: [SourcesService],
  controllers: [AdminSourcesController],
  exports: [SourcesService],
})
export class SourceIngestionModule {}
