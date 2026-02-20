import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsIn, IsObject, IsOptional } from 'class-validator';
import { InternalJobsService } from '../../application/services/internal-jobs.service';

class TriggerJobDto {
  @IsIn(['sync-news', 'process-raw', 'telegram-post'])
  job!: 'sync-news' | 'process-raw' | 'telegram-post';

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}

@ApiTags('internal-jobs')
@ApiBearerAuth()
@Controller('internal/jobs')
export class InternalJobsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly internalJobsService: InternalJobsService,
  ) {}

  @Post('trigger')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Trigger an internal job (phase-1 placeholder)' })
  @ApiBody({ type: TriggerJobDto })
  async triggerJob(
    @Headers('x-internal-token') internalToken: string | undefined,
    @Body() dto: TriggerJobDto,
  ) {
    const expectedToken = this.configService.get<string>('security.internalToken');
    if (!expectedToken || internalToken !== expectedToken) {
      throw new UnauthorizedException('Invalid internal token');
    }

    const result = await this.internalJobsService.trigger(dto.job, dto.payload ?? {});
    return { accepted: true, ...result };
  }
}
