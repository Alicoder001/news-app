import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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
  slugs(@Query('limit') limit?: number) {
    return this.articlesService.slugs(limit ?? 1000);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured articles (phase-1 scaffold)' })
  featured(@Query('limit') limit?: number) {
    return this.articlesService.featured(limit ?? 5);
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
