import { Injectable, Logger } from '@nestjs/common';

interface TelegramArticlePayload {
  title: string;
  summary: string;
  url: string;
  category?: string | null;
}

@Injectable()
export class TelegramDispatchService {
  private readonly logger = new Logger(TelegramDispatchService.name);

  async postArticle(payload: TelegramArticlePayload): Promise<boolean> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      this.logger.warn('Telegram credentials are missing. Skip post.');
      return false;
    }

    const text = [
      `<b>${payload.title}</b>`,
      '',
      payload.summary || '',
      '',
      payload.category ? `#${payload.category.replace(/\s+/g, '_')}` : '',
      payload.url,
    ]
      .filter(Boolean)
      .join('\n');

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });

    if (!response.ok) {
      this.logger.error(`Telegram API returned ${response.status}`);
      return false;
    }

    const data = (await response.json()) as { ok?: boolean };
    return data.ok === true;
  }
}
