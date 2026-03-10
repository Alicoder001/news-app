import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CategoriesService } from '../../application/services/categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get categories list (phase-1 scaffold)' })
  list() {
    return this.categoriesService.list();
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top categories ordered by article count' })
  top(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    const safeLimit = Math.max(1, Math.min(limit ?? 8, 20));
    return this.categoriesService.listTop(safeLimit);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category by slug' })
  getBySlug(@Param('slug') slug: string) {
    return this.categoriesService.getBySlug(slug);
  }
}
