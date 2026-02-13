import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBySlug(slug: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { slug },
    });

    if (!tag) {
      throw new NotFoundException(`Tag not found: ${slug}`);
    }

    return {
      success: true,
      data: {
        tag: {
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        },
      },
    };
  }
}
