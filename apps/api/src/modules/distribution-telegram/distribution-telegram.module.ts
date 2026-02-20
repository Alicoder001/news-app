import { Module } from '@nestjs/common';

import { TelegramDispatchService } from './application/services/telegram-dispatch.service';
import { AdminTelegramController } from './presentation/controllers/admin-telegram.controller';

@Module({
  providers: [TelegramDispatchService],
  controllers: [AdminTelegramController],
})
export class DistributionTelegramModule {}
