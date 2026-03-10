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
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { AiUsageService } from '../../application/services/ai-usage.service';

class TrackUsageDto {
  @IsString()
  model!: string;

  @IsString()
  operation!: string;

  @IsInt()
  @Min(0)
  promptTokens!: number;

  @IsInt()
  @Min(0)
  completionTokens!: number;

  @IsInt()
  @Min(0)
  totalTokens!: number;

  @IsNumber()
  @Min(0)
  cost!: number;

  @IsOptional()
  @IsString()
  articleId?: string;
}

@ApiTags('internal-usage')
@Controller('internal/usage')
export class InternalUsageController {
  constructor(
    private readonly configService: ConfigService,
    private readonly aiUsageService: AiUsageService,
  ) {}

  @Post('track')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Track AI usage event via internal token' })
  @ApiBody({ type: TrackUsageDto })
  async track(
    @Headers('x-internal-token') internalToken: string | undefined,
    @Body() dto: TrackUsageDto,
  ) {
    const expectedToken = this.configService.get<string>('security.internalToken');
    if (!expectedToken || internalToken !== expectedToken) {
      throw new UnauthorizedException('Invalid internal token');
    }

    return this.aiUsageService.create(dto);
  }
}
