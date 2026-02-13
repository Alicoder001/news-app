import { Injectable, NotFoundException } from '@nestjs/common';
import { SourceType } from '@prisma/client';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

import { CreateSourceDto } from '../../presentation/dto/create-source.dto';
import { UpdateSourceDto } from '../../presentation/dto/update-source.dto';

@Injectable()
export class SourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const sources = await this.prisma.newsSource.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { RawArticle: true },
        },
      },
    });

    return {
      success: true,
      data: {
        sources: sources.map((source) => ({
          id: source.id,
          name: source.name,
          url: source.url,
          type: source.type,
          isActive: source.isActive,
          lastFetched: source.lastFetched ? source.lastFetched.toISOString() : null,
          createdAt: source.createdAt.toISOString(),
          rawArticleCount: source._count.RawArticle,
        })),
      },
    };
  }

  async create(dto: CreateSourceDto) {
    const source = await this.prisma.newsSource.create({
      data: {
        name: dto.name,
        type: dto.type ?? 'RSS',
        url: dto.url,
        isActive: dto.isActive ?? true,
      },
    });

    return {
      success: true,
      data: source,
    };
  }

  async update(id: string, dto: UpdateSourceDto) {
    const existing = await this.prisma.newsSource.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Source not found: ${id}`);
    }

    const source = await this.prisma.newsSource.update({
      where: { id },
      data: {
        name: dto.name,
        type: dto.type as SourceType | undefined,
        url: dto.url,
        isActive: dto.isActive,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      data: source,
    };
  }

  async toggle(id: string) {
    const existing = await this.prisma.newsSource.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Source not found: ${id}`);
    }

    const source = await this.prisma.newsSource.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    return {
      success: true,
      data: source,
    };
  }

  async remove(id: string) {
    const existing = await this.prisma.newsSource.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Source not found: ${id}`);
    }

    await this.prisma.newsSource.delete({ where: { id } });

    return {
      success: true,
      data: {
        deleted: true,
        id,
      },
    };
  }
}
