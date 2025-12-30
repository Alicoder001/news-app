export class TelegramService {
  private static botToken = process.env.TELEGRAM_BOT_TOKEN;
  private static chatId = process.env.TELEGRAM_CHAT_ID;

  static async postArticle(article: { title: string; summary: string; url: string }) {
    if (!this.botToken || !this.chatId) {
      console.warn('Telegram credentials missing, skipping post.');
      return null;
    }

    const text = `<b>${article.title}</b>\n\n${article.summary}\n\n<a href="${article.url}">Batafsil o'qish</a>`;
    
    // Simulate API call for now
    console.log(`Posting to Telegram: ${text}`);
    
    return "simulated_msg_id";
  }
}
