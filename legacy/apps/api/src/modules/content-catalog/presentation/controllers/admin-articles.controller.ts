import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ArticlesService } from '../../application/services/articles.service';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { AdminAuditInterceptor } from '../../../identity-access/infrastructure/interceptors/admin-audit.interceptor';
import { JwtAuthGuard } from '../../../identity-access/infrastructure/security/jwt-auth.guard';
import { Roles } from '../../../identity-access/infrastructure/security/roles.decorator';
import { RolesGuard } from '../../../identity-access/infrastructure/security/roles.guard';

@ApiTags('admin-articles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'EDITOR')
@UseInterceptors(AdminAuditInterceptor)
@Controller('admin/articles')
export class AdminArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Get admin article list' })
  list(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.articlesService.adminList(page ?? 1, limit ?? 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin article by id (phase-1 scaffold)' })
  getById(@Param('id') id: string) {
    return this.articlesService.adminGetById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update admin article (phase-1 scaffold)' })
  updateById(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.articlesService.adminUpdateById(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete admin article (phase-1 scaffold)' })
  deleteById(@Param('id') id: string) {
    return this.articlesService.adminDeleteById(id);
  }
}
