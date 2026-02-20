import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { TagsService } from '../../application/services/tags.service';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Get tag by slug' })
  getBySlug(@Param('slug') slug: string) {
    return this.tagsService.getBySlug(slug);
  }
}
