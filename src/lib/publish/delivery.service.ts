import { DeliveryChannel, DeliveryStatus } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

type DeliveryInput = {
  articleId: string;
  channel: keyof typeof DeliveryChannel | DeliveryChannel;
  status: keyof typeof DeliveryStatus | DeliveryStatus;
  externalId?: string;
  errorMessage?: string;
};

export async function createDeliveryRecord(input: DeliveryInput) {
  return prisma.delivery.create({
    data: {
      articleId: input.articleId,
      channel: input.channel as DeliveryChannel,
      status: input.status as DeliveryStatus,
      externalId: input.externalId ?? null,
      errorMessage: input.errorMessage ?? null,
    },
  });
}
