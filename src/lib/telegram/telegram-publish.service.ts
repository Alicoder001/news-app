import { createDeliveryRecord } from '@/lib/publish/delivery.service';
import { getEnv } from '@/lib/validation/env';

type TelegramPublishInput = {
  articleId: string;
  text: string;
};

export async function publishTelegramPost(input: TelegramPublishInput) {
  const env = getEnv();
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHANNEL_ID,
      text: input.text,
      disable_web_page_preview: false,
    }),
  });

  const payload = (await response.json()) as {
    ok?: boolean;
    result?: { message_id?: number };
    description?: string;
  };

  if (!response.ok || payload.ok !== true) {
    await createDeliveryRecord({
      articleId: input.articleId,
      channel: 'TELEGRAM',
      status: 'FAILED',
      errorMessage: payload.description ?? `Telegram API error: ${response.status}`,
    });

    return {
      success: false,
      messageId: null,
      error: payload.description ?? 'Telegram publish failed',
    };
  }

  await createDeliveryRecord({
    articleId: input.articleId,
    channel: 'TELEGRAM',
    status: 'SUCCESS',
    externalId: payload.result?.message_id?.toString(),
  });

  return {
    success: true,
    messageId: payload.result?.message_id?.toString() ?? null,
    error: null,
  };
}
