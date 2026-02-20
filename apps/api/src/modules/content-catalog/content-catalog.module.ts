import { Module } from '@nestjs/common';

import { ArticlesService } from './application/services/articles.service';
import { CategoriesService } from './application/services/categories.service';
import { TagsService } from './application/services/tags.service';
import { AdminArticlesController } from './presentation/controllers/admin-articles.controller';
import { ArticlesController } from './presentation/controllers/articles.controller';
import { CategoriesController } from './presentation/controllers/categories.controller';
import { TagsController } from './presentation/controllers/tags.controller';

@Module({
  providers: [ArticlesService, CategoriesService, TagsService],
  controllers: [ArticlesController, CategoriesController, TagsController, AdminArticlesController],
  exports: [ArticlesService, CategoriesService, TagsService],
})
export class ContentCatalogModule {}
