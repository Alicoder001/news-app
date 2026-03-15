import { prisma } from '@/lib/db/prisma';
import { SourceType } from '@prisma/client';
import type { RssSourceInput } from './types';
import { NotFoundError } from '@/lib/errors/domain';

export async function listSources() {
  return prisma.source.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createSource(input: RssSourceInput) {
  return prisma.source.create({
    data: {
      name: input.name,
      url: input.url,
      type: SourceType.RSS,
      isActive: input.isActive ?? true,
    },
  });
}

export async function toggleSource(id: string) {
  const source = await prisma.source.findUnique({ where: { id } });
  if (!source) {
    throw new NotFoundError(`Source not found: ${id}`);
  }

  return prisma.source.update({
    where: { id },
    data: {
      isActive: !source.isActive,
    },
  });
}
