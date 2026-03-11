import { prisma } from '@/lib/db/prisma';

export async function markSourceFetched(sourceId: string) {
  return prisma.source.update({
    where: { id: sourceId },
    data: {
      lastFetchedAt: new Date(),
    },
  });
}
