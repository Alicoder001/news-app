import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { validateEnv } from './config/env.schema';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { ContentCatalogModule } from './modules/content-catalog/content-catalog.module';
import { ContentProcessingModule } from './modules/content-processing/content-processing.module';
import { DistributionTelegramModule } from './modules/distribution-telegram/distribution-telegram.module';
import { IdentityAccessModule } from './modules/identity-access/identity-access.module';
import { OperationsModule } from './modules/operations/operations.module';
import { SourceIngestionModule } from './modules/source-ingestion/source-ingestion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validate: validateEnv,
    }),
    PrismaModule,
    OperationsModule,
    IdentityAccessModule,
    ContentCatalogModule,
    SourceIngestionModule,
    ContentProcessingModule,
    DistributionTelegramModule,
  ],
})
export class AppModule {}
