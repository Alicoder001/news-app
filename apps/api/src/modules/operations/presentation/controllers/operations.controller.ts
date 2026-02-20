import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

@ApiTags('operations')
@Controller()
export class OperationsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Liveness probe endpoint' })
  @ApiOkResponse({ description: 'Service is alive' })
  health() {
    return {
      status: 'ok',
      service: 'news-app-api',
      timestamp: new Date().toISOString(),
      uptimeSec: process.uptime(),
    };
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Readiness probe endpoint' })
  @ApiOkResponse({ description: 'Service readiness status' })
  async readiness() {
    const requiredKeys = [
      'infrastructure.databaseUrl',
      'security.jwtAccessSecret',
      'security.jwtRefreshSecret',
      'security.internalToken',
      'infrastructure.redisUrl',
    ] as const;

    const missing = requiredKeys.filter(
      (key) => !this.configService.get<string>(key),
    );

    let dbReady = false;
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      dbReady = true;
    } catch {
      dbReady = false;
    }

    return {
      status: missing.length === 0 && dbReady ? 'ready' : 'degraded',
      timestamp: new Date().toISOString(),
      missing,
      checks: {
        db: dbReady ? 'up' : 'down',
      },
    };
  }
}
