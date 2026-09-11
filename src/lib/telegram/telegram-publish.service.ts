import { createDeliveryRecord } from '@/lib/publish/delivery.service';
import { getEnv } from '@/lib/validation/env';
import {
  escapeTelegramHtml,
  formatTelegramPost,
  type TelegramSourceRef,
} from '@/lib/telegram/telegram-format';

export type { TelegramSourceRef };

export type TelegramPublishInput = {
  articleId: string;
  text?: string;
  title?: string;
  shortSummary?: string;
  websiteUrl?: string | null;
  category?: string | null;
  tags?: string[] | null;
  sourceRefs?: TelegramSourceRef[] | null;
};

export type TelegramPublishResult = {
  success: boolean;
  messageId?: string | null;
  error?: string | null;
  retryable: boolean;
};

export type TelegramDeleteResult = {
  success: boolean;
  error?: string | null;
};

export async function deleteTelegramPost(messageId: string): Promise<TelegramDeleteResult> {
  const env = getEnv();

  try {
    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/deleteMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHANNEL_ID,
        message_id: Number(messageId),
      }),
    });

    if (!response.ok) {
      return { success: false, error: `Telegram API error: ${response.status}` };
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Telegram network request failed' };
  }
}

type TelegramApiPayload = {
  ok?: boolean;
  result?: { message_id?: number };
  description?: string;
  parameters?: { retry_after?: number };
};

function isRetryableFailure(status: number, description?: string): boolean {
  if (status === 429) {
    return true;
  }
  if (status === 408) {
    return true;
  }
  if (status >= 500) {
    return true;
  }

  const desc = (description ?? '').toLowerCase();
  if (
    desc.includes('too many requests') ||
    desc.includes('retry after') ||
    desc.includes('flood control') ||
    desc.includes('timeout') ||
    desc.includes('temporarily unavailable') ||
    desc.includes('server error') ||
    desc.includes('bad gateway') ||
    desc.includes('service unavailable') ||
    desc.includes('gateway timeout')
  ) {
    return true;
  }

  return false;
}

function buildHtmlText(input: TelegramPublishInput): string {
  const hasStructuredFields = input.title !== undefined || input.shortSummary !== undefined;

  if (hasStructuredFields) {
    const title = input.title?.trim() || input.text?.trim() || 'Untitled';
    const shortSummary = input.shortSummary?.trim() || input.text?.trim() || '';
    return formatTelegramPost({
      title,
      shortSummary,
      websiteUrl: input.websiteUrl ?? null,
      category: input.category ?? null,
      tags: input.tags ?? null,
      sourceRefs: input.sourceRefs ?? null,
    });
  }

  return escapeTelegramHtml(input.text?.trim() || '');
}

export async function publishTelegramPost(input: TelegramPublishInput): Promise<TelegramPublishResult> {
  const env = getEnv();
  const text = buildHtmlText(input);

  let response: Response;
  try {
    response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHANNEL_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Telegram network request failed';

    await createDeliveryRecord({
      articleId: input.articleId,
      channel: 'TELEGRAM',
      status: 'FAILED',
      errorMessage: message,
    });

    return {
      success: false,
      messageId: null,
      error: message,
      retryable: true,
    };
  }

  let payload: TelegramApiPayload | null = null;
  try {
    payload = (await response.json()) as TelegramApiPayload;
  } catch {
    payload = null;
  }

  const description =
    payload?.description ?? (response.ok ? undefined : `Telegram API error: ${response.status}`);
  const retryAfter = payload?.parameters?.retry_after;
  const errorMessage =
    retryAfter !== undefined && description
      ? `${description} (retry after ${retryAfter}s)`
      : (description ?? 'Telegram publish failed');

  if (!response.ok || payload?.ok !== true) {
    const retryable = isRetryableFailure(response.status, payload?.description);

    await createDeliveryRecord({
      articleId: input.articleId,
      channel: 'TELEGRAM',
      status: 'FAILED',
      errorMessage,
    });

    return {
      success: false,
      messageId: null,
      error: errorMessage,
      retryable,
    };
  }

  const messageId = payload?.result?.message_id?.toString() ?? null;

  await createDeliveryRecord({
    articleId: input.articleId,
    channel: 'TELEGRAM',
    status: 'SUCCESS',
    externalId: messageId ?? undefined,
  });

  return {
    success: true,
    messageId,
    error: null,
    retryable: false,
  };
}
