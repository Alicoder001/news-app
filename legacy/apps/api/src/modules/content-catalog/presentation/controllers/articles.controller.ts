import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ArticlesService } from '../../application/services/articles.service';
import { ListArticlesQueryDto } from '../dto/list-articles-query.dto';
import { ViewArticleDto } from '../dto/view-article.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Get articles list (phase-1 scaffold)' })
  list(@Query() query: ListArticlesQueryDto) {
    return this.articlesService.list(query);
  }

  @Get('slugs')
  @ApiOperation({ summary: 'Get article slugs for sitemap/static params' })
  slugs(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    const safeLimit = Math.max(1, Math.min(limit ?? 1000, 5000));
    return this.articlesService.slugs(safeLimit);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured articles (phase-1 scaffold)' })
  featured(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    const safeLimit = Math.max(1, Math.min(limit ?? 5, 20));
    return this.articlesService.featured(safeLimit);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get article by slug (phase-1 scaffold)' })
  getBySlug(@Param('slug') slug: string) {
    return this.articlesService.getBySlug(slug);
  }

  @Post('view')
  @ApiOperation({ summary: 'Increment article view (phase-1 scaffold)' })
  view(@Body() dto: ViewArticleDto) {
    return this.articlesService.view(dto);
  }
}
