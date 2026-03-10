import { 
  formatArticlePost, 
  formatBreakingNews, 
  getArticleKeyboard,
  type TelegramArticle 
} from '../telegram-templates';

/**
 * Telegram Bot Service
 * 
 * Handles posting articles to Telegram channel via Bot API.
 * 
 * Features:
 * - HTML message formatting
 * - Inline keyboards
 * - Retry logic
 * - Graceful fallback when credentials missing
 * 
 * @author Aishunos Team
 * @version 2.0.0
 */

/**
 * Telegram API response types
 */
interface TelegramResponse {
  ok: boolean;
  result?: {
    message_id: number;
    chat: { id: number };
    date: number;
  };
  error_code?: number;
  description?: string;
}

/**
 * Configuration
 */
const TELEGRAM_CONFIG = {
  API_BASE: 'https://api.telegram.org/bot',
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const;

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Telegram Service Class
 */
export class TelegramService {
  private static botToken = process.env.TELEGRAM_BOT_TOKEN;
  private static chatId = process.env.TELEGRAM_CHAT_ID;

  /**
   * Check if service is configured
   */
  static isConfigured(): boolean {
    return !!(this.botToken && this.chatId);
  }

  /**
   * Get API URL for a method
   */
  private static getApiUrl(method: string): string {
    return `${TELEGRAM_CONFIG.API_BASE}${this.botToken}/${method}`;
  }

  /**
   * Make API request with retry
   */
  private static async apiRequest(
    method: string,
    body: Record<string, unknown>,
    attempt: number = 0
  ): Promise<TelegramResponse> {
    try {
      const response = await fetch(this.getApiUrl(method), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data: TelegramResponse = await response.json();

      if (!data.ok) {
        // Check for rate limit
        if (data.error_code === 429 && attempt < TELEGRAM_CONFIG.RETRY_ATTEMPTS) {
          console.log(`⏳ Telegram rate limited. Retrying in ${TELEGRAM_CONFIG.RETRY_DELAY_MS}ms...`);
          await sleep(TELEGRAM_CONFIG.RETRY_DELAY_MS * (attempt + 1));
          return this.apiRequest(method, body, attempt + 1);
        }
        throw new Error(`Telegram API error: ${data.description}`);
      }

      return data;
    } catch (error) {
      if (attempt < TELEGRAM_CONFIG.RETRY_ATTEMPTS) {
        console.log(`🔄 Telegram request failed. Retrying... (${attempt + 1}/${TELEGRAM_CONFIG.RETRY_ATTEMPTS})`);
        await sleep(TELEGRAM_CONFIG.RETRY_DELAY_MS);
        return this.apiRequest(method, body, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Post an article to the channel
   * 
   * @returns Message ID if successful, null otherwise
   */
  static async postArticle(article: TelegramArticle): Promise<string | null> {
    if (!this.isConfigured()) {
      console.warn('⚠️ Telegram credentials missing. Skipping post.');
      console.log(`📝 Would post: "${article.title}"`);
      return null;
    }

    try {
      // Choose template based on importance
      const text = article.importance === 'CRITICAL'
        ? formatBreakingNews(article)
        : formatArticlePost(article);

      const response = await this.apiRequest('sendMessage', {
        chat_id: this.chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
        reply_markup: getArticleKeyboard(article.url),
      });

      if (response.ok && response.result) {
        console.log(`✅ Posted to Telegram: ${article.title.slice(0, 50)}...`);
        return response.result.message_id.toString();
      }

      return null;
    } catch (error) {
      console.error(`❌ Failed to post to Telegram: ${error}`);
      return null;
    }
  }

  /**
   * Send a custom message to the channel
   */
  static async sendMessage(
    text: string,
    options: {
      parseMode?: 'HTML' | 'Markdown';
      disablePreview?: boolean;
      replyMarkup?: Record<string, unknown>;
    } = {}
  ): Promise<string | null> {
    if (!this.isConfigured()) {
      console.warn('⚠️ Telegram credentials missing.');
      return null;
    }

    try {
      const response = await this.apiRequest('sendMessage', {
        chat_id: this.chatId,
        text,
        parse_mode: options.parseMode || 'HTML',
        disable_web_page_preview: options.disablePreview ?? false,
        reply_markup: options.replyMarkup,
      });

      return response.result?.message_id.toString() || null;
    } catch (error) {
      console.error(`❌ Failed to send message: ${error}`);
      return null;
    }
  }

  /**
   * Get bot info (useful for testing connection)
   */
  static async getMe(): Promise<{ username: string; firstName: string } | null> {
    if (!this.botToken) {
      return null;
    }

    try {
      const response = await fetch(this.getApiUrl('getMe'));
      const data = await response.json();
      
      if (data.ok) {
        return {
          username: data.result.username,
          firstName: data.result.first_name,
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Test connection to Telegram
   */
  static async testConnection(): Promise<{
    configured: boolean;
    connected: boolean;
    botName?: string;
  }> {
    if (!this.isConfigured()) {
      return { configured: false, connected: false };
    }

    const botInfo = await this.getMe();
    
    return {
      configured: true,
      connected: !!botInfo,
      botName: botInfo?.username,
    };
  }
}
