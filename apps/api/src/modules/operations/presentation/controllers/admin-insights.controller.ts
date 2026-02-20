import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminAuditInterceptor } from '../../../identity-access/infrastructure/interceptors/admin-audit.interceptor';
import { JwtAuthGuard } from '../../../identity-access/infrastructure/security/jwt-auth.guard';
import { Roles } from '../../../identity-access/infrastructure/security/roles.decorator';
import { RolesGuard } from '../../../identity-access/infrastructure/security/roles.guard';
import { AdminInsightsService } from '../../application/services/admin-insights.service';
import { AiUsageService } from '../../application/services/ai-usage.service';

@ApiTags('admin-insights')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'EDITOR')
@UseInterceptors(AdminAuditInterceptor)
@Controller('admin')
export class AdminInsightsController {
  constructor(
    private readonly adminInsightsService: AdminInsightsService,
    private readonly aiUsageService: AiUsageService,
  ) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get admin dashboard overview' })
  overview() {
    return this.adminInsightsService.overview();
  }

  @Get('pipeline/runs')
  @ApiOperation({ summary: 'Get pipeline run history' })
  pipelineRuns(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.adminInsightsService.pipelineRuns(limit ?? 50);
  }

  @Get('usage/summary')
  @ApiOperation({ summary: 'Get AI usage summary' })
  async usageSummary(
    @Query('days', new ParseIntPipe({ optional: true })) days?: number,
  ) {
    const safeDays = Math.max(1, Math.min(days ?? 30, 365));
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - safeDays);

    const usage = await this.aiUsageService.stats(startDate);
    const daily = await this.aiUsageService.daily(Math.min(safeDays, 90));
    return {
      success: true,
      data: {
        usage,
        daily,
      },
    };
  }

  @Get('usage/recent')
  @ApiOperation({ summary: 'Get recent AI usage events' })
  async usageRecent(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const rows = await this.aiUsageService.recent(Math.max(1, Math.min(limit ?? 20, 100)));
    return {
      success: true,
      data: {
        rows,
      },
    };
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get settings and system info' })
  settings() {
    return this.adminInsightsService.settings();
  }
}
