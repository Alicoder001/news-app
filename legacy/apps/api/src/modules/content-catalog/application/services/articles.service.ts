import { Injectable, NotFoundException } from '@nestjs/common';
import { Difficulty, Importance, Prisma } from '@prisma/client';
import type { Article, ArticleListItem } from '@news-app/api-types';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

import { ListArticlesQueryDto } from '../../presentation/dto/list-articles-query.dto';
import { UpdateArticleDto } from '../../presentation/dto/update-article.dto';
import { ViewArticleDto } from '../../presentation/dto/view-article.dto';

type CompatArticleListItem = ArticleListItem & {
  tags?: Array<{ id: string; name: string; slug: string }>;
};

type ArticleWithCategoryAndTags = Prisma.ArticleGetPayload<{
  include: { category: true; tags: true };
}>;

type ArticleWithRawSource = Prisma.ArticleGetPayload<{
  include: { category: true; tags: true; rawArticle: { include: { source: true } } };
}>;

type AdminArticleListRow = Prisma.ArticleGetPayload<{
  include: { category: true; rawArticle: { include: { source: true } } };
}>;

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  private toArticleListItem(
    article: Prisma.ArticleGetPayload<{
      include: { category: true; tags: true };
    }>,
  ): CompatArticleListItem {
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      imageUrl: article.imageUrl,
      category: article.category
        ? {
            id: article.category.id,
            slug: article.category.slug,
            name: article.category.name,
            icon: article.category.icon,
            color: article.category.color,
          }
        : null,
      readingTime: article.readingTime,
      difficulty: article.difficulty,
      importance: article.importance,
      viewCount: article.viewCount,
      createdAt: article.createdAt.toISOString(),
      tags: article.tags.map((tag: { id: string; name: string; slug: string }) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      })),
    };
  }

  private toArticle(
    article: Prisma.ArticleGetPayload<{
      include: { category: true; tags: true };
    }>,
  ): Article {
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      content: article.content,
      imageUrl: article.imageUrl,
      originalUrl: article.originalUrl,
      category: article.category
        ? {
            id: article.category.id,
            slug: article.category.slug,
            name: article.category.name,
            nameEn: article.category.nameEn,
            description: article.category.description,
            icon: article.category.icon,
            color: article.category.color,
          }
        : null,
      tags: article.tags.map((tag: { id: string; name: string; slug: string }) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      })),
      readingTime: article.readingTime,
      wordCount: article.wordCount,
      difficulty: article.difficulty,
      importance: article.importance,
      viewCount: article.viewCount,
      shareCount: article.shareCount,
      telegramPosted: article.telegramPosted,
      telegramPostId: article.telegramPostId,
      language: article.language,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    };
  }

  async list(query: ListArticlesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const where: Prisma.ArticleWhereInput = {};

    if (query.category) {
      where.category = {
        slug: query.category,
      };
    }

    if (query.tag) {
      where.tags = {
        some: { slug: query.tag },
      };
    }

    if (query.sort === 'trending') {
      const days = query.days ?? 7;
      where.createdAt = {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      };
    }

    const orderBy: Prisma.ArticleOrderByWithRelationInput =
      query.sort === 'trending'
        ? { viewCount: 'desc' }
        : { createdAt: 'desc' };

    if (query.includeRawSource) {
      const [articles, total] = await this.prisma.$transaction([
        this.prisma.article.findMany({
          where,
          include: {
            category: true,
            tags: true,
            rawArticle: {
              include: {
                source: true,
              },
            },
          },
          orderBy,
          skip,
          take: limit,
        }),
        this.prisma.article.count({ where }),
      ]);

      const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

      return {
        success: true,
        data: {
          articles: articles.map((article: ArticleWithRawSource) => ({
            ...this.toArticleListItem(article),
            rawArticle: article.rawArticle
              ? {
                  source: article.rawArticle.source
                    ? {
                        id: article.rawArticle.source.id,
                        name: article.rawArticle.source.name,
                        url: article.rawArticle.source.url,
                      }
                    : null,
                }
              : null,
          })),
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: totalPages > 0 ? page < totalPages : false,
            hasPrevPage: page > 1,
          },
        },
      };
    }

    const [articles, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        where,
        include: {
          category: true,
          tags: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.article.count({ where }),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      success: true,
      data: {
        articles: articles.map((article: ArticleWithCategoryAndTags) => this.toArticleListItem(article)),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: totalPages > 0 ? page < totalPages : false,
          hasPrevPage: page > 1,
        },
      },
    };
  }

  async getBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
        rawArticle: {
          include: {
            source: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException(`Article not found: ${slug}`);
    }

    return {
      success: true,
      data: {
        article: {
          ...this.toArticle(article),
          rawArticle: article.rawArticle
            ? {
                id: article.rawArticle.id,
                publishedAt: article.rawArticle.publishedAt
                  ? article.rawArticle.publishedAt.toISOString()
                  : null,
                source: article.rawArticle.source
                  ? {
                      id: article.rawArticle.source.id,
                      name: article.rawArticle.source.name,
                      url: article.rawArticle.source.url,
                    }
                  : null,
              }
            : null,
        },
      },
    };
  }

  async featured(limit: number) {
    const articles = await this.prisma.article.findMany({
      where: {
        importance: 'CRITICAL',
      },
      include: {
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return {
      success: true,
      data: {
        articles: articles.map((article: ArticleWithCategoryAndTags) => this.toArticleListItem(article)),
      },
    };
  }

  async slugs(limit: number) {
    const rows = await this.prisma.article.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return {
      success: true,
      data: {
        articles: rows.map((row: { slug: string; updatedAt: Date }) => ({
          slug: row.slug,
          updatedAt: row.updatedAt.toISOString(),
        })),
      },
    };
  }

  async adminList(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [articles, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          rawArticle: {
            include: { source: true },
          },
        },
      }),
      this.prisma.article.count(),
    ]);

    return {
      success: true,
      data: {
        articles: articles.map((article: AdminArticleListRow) => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          summary: article.summary,
          imageUrl: article.imageUrl,
          viewCount: article.viewCount,
          createdAt: article.createdAt.toISOString(),
          category: article.category
            ? {
                id: article.category.id,
                name: article.category.name,
                slug: article.category.slug,
              }
            : null,
          rawArticle: article.rawArticle
            ? {
                source: article.rawArticle.source
                  ? {
                      id: article.rawArticle.source.id,
                      name: article.rawArticle.source.name,
                      url: article.rawArticle.source.url,
                    }
                  : null,
              }
            : null,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: total === 0 ? 0 : Math.ceil(total / limit),
        },
      },
    };
  }

  async view(dto: ViewArticleDto) {
    const existing = await this.prisma.article.findUnique({
      where: { slug: dto.slug },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException(`Article not found: ${dto.slug}`);
    }

    const updated = await this.prisma.article.update({
      where: { slug: dto.slug },
      data: {
        viewCount: { increment: 1 },
      },
      select: {
        slug: true,
        viewCount: true,
      },
    });

    return {
      success: true,
      data: updated,
    };
  }

  async adminGetById(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
        rawArticle: {
          include: { source: true },
        },
      },
    });

    if (!article) {
      throw new NotFoundException(`Article not found: ${id}`);
    }

    return {
      success: true,
      data: {
        article: {
          ...this.toArticle(article),
          rawArticle: article.rawArticle
            ? {
                id: article.rawArticle.id,
                publishedAt: article.rawArticle.publishedAt
                  ? article.rawArticle.publishedAt.toISOString()
                  : null,
                source: article.rawArticle.source
                  ? {
                      id: article.rawArticle.source.id,
                      name: article.rawArticle.source.name,
                      url: article.rawArticle.source.url,
                    }
                  : null,
              }
            : null,
        },
      },
    };
  }

  async adminUpdateById(id: string, dto: UpdateArticleDto) {
    const existing = await this.prisma.article.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Article not found: ${id}`);
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const slugExists = await this.prisma.article.findUnique({
        where: { slug: dto.slug },
        select: { id: true },
      });
      if (slugExists) {
        return {
          success: false,
          error: {
            code: 'SLUG_ALREADY_EXISTS',
            message: 'Bu slug allaqachon mavjud',
          },
        };
      }
    }

    const difficulty = dto.difficulty
      ? (dto.difficulty.toUpperCase() as Difficulty)
      : undefined;
    const importance = dto.importance
      ? (dto.importance.toUpperCase() as Importance)
      : undefined;

    const article = await this.prisma.article.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        summary: dto.summary ?? undefined,
        content: dto.content,
        imageUrl: dto.imageUrl ?? undefined,
        categoryId: dto.categoryId ?? undefined,
        difficulty,
        importance,
        readingTime: dto.readingTime ?? undefined,
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    });

    return {
      success: true,
      data: article,
    };
  }

  async adminDeleteById(id: string) {
    const existing = await this.prisma.article.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Article not found: ${id}`);
    }

    await this.prisma.article.delete({ where: { id } });

    return {
      success: true,
      data: {
        deleted: true,
        id,
      },
    };
  }
}
