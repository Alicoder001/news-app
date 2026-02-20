import { Module } from '@nestjs/common';

import { AdminInsightsService } from './application/services/admin-insights.service';
import { AiUsageService } from './application/services/ai-usage.service';
import { InternalJobsService } from './application/services/internal-jobs.service';
import { AdminInsightsController } from './presentation/controllers/admin-insights.controller';
import { InternalJobsController } from './presentation/controllers/internal-jobs.controller';
import { InternalUsageController } from './presentation/controllers/internal-usage.controller';
import { OperationsController } from './presentation/controllers/operations.controller';

@Module({
  providers: [InternalJobsService, AiUsageService, AdminInsightsService],
  controllers: [
    OperationsController,
    InternalJobsController,
    InternalUsageController,
    AdminInsightsController,
  ],
})
export class OperationsModule {}
