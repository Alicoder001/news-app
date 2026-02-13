import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return {
      success: true,
      data: {
        categories: categories.map((category) => ({
          id: category.id,
          slug: category.slug,
          name: category.name,
          nameEn: category.nameEn,
          description: category.description,
          icon: category.icon,
          color: category.color,
        })),
      },
    };
  }

  async listTop(limit: number) {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: {
        articles: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return {
      success: true,
      data: {
        categories: categories.map((category) => ({
          id: category.id,
          slug: category.slug,
          name: category.name,
          nameEn: category.nameEn,
          description: category.description,
          icon: category.icon,
          color: category.color,
          articleCount: category._count.articles,
        })),
      },
    };
  }

  async getBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException(`Category not found: ${slug}`);
    }

    return {
      success: true,
      data: {
        category: {
          id: category.id,
          slug: category.slug,
          name: category.name,
          nameEn: category.nameEn,
          description: category.description,
          icon: category.icon,
          color: category.color,
        },
      },
    };
  }
}
