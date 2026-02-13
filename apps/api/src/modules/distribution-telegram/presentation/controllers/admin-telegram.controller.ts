import {
  Controller,
  NotFoundException,
  Param,
  Post,
  ServiceUnavailableException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { AdminAuditInterceptor } from '../../../identity-access/infrastructure/interceptors/admin-audit.interceptor';
import { JwtAuthGuard } from '../../../identity-access/infrastructure/security/jwt-auth.guard';
import { Roles } from '../../../identity-access/infrastructure/security/roles.decorator';
import { RolesGuard } from '../../../identity-access/infrastructure/security/roles.guard';
import { TelegramDispatchService } from '../../application/services/telegram-dispatch.service';

@ApiTags('admin-telegram')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'EDITOR')
@UseInterceptors(AdminAuditInterceptor)
@Controller('admin/articles')
export class AdminTelegramController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramDispatchService: TelegramDispatchService,
  ) {}

  @Post(':id/telegram')
  @ApiOperation({ summary: 'Post article to Telegram' })
  async postToTelegram(@Param('id') id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!article) {
      throw new NotFoundException(`Article not found: ${id}`);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aishunos.uz';
    const articleUrl = `${appUrl}/articles/${article.slug}`;

    const sent = await this.telegramDispatchService.postArticle({
      title: article.title,
      summary: article.summary || article.title,
      url: articleUrl,
      category: article.category?.name,
    });

    if (!sent) {
      throw new ServiceUnavailableException('Telegram post failed');
    }

    await this.prisma.article.update({
      where: { id: article.id },
      data: {
        telegramPosted: true,
      },
    });

    return {
      success: true,
      data: {
        sent: true,
        articleId: article.id,
        articleUrl,
      },
    };
  }
}
