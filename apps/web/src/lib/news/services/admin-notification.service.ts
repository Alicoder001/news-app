/**
 * Admin Notification Service
 * 
 * Pipeline holatlari haqida adminni Telegram orqali xabardor qiladi.
 * Faqat TELEGRAM_ADMIN_USER_ID ga yuboradi.
 */

const TELEGRAM_CONFIG = {
  API_BASE: 'https://api.telegram.org/bot',
} as const;

/**
 * Get admin credentials
 */
function getConfig() {
  return {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    adminUserId: process.env.TELEGRAM_ADMIN_USER_ID,
  };
}

/**
 * Check if admin notifications are configured
 */
export function isAdminNotificationConfigured(): boolean {
  const { botToken, adminUserId } = getConfig();
  return !!(botToken && adminUserId);
}

/**
 * Send notification to admin
 */
export async function notifyAdmin(
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
): Promise<boolean> {
  const { botToken, adminUserId } = getConfig();
  
  if (!botToken || !adminUserId) {
    console.log(`[Admin] ${message}`);
    return false;
  }
  
  const emoji = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }[type];
  
  const text = `${emoji} <b>Pipeline Status</b>\n\n${message}\n\n<i>${new Date().toLocaleString('uz-UZ')}</i>`;
  
  try {
    const res = await fetch(`${TELEGRAM_CONFIG.API_BASE}${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: adminUserId,
        text,
        parse_mode: 'HTML',
      }),
    });
    
    const data = await res.json();
    return data.ok === true;
  } catch (error) {
    console.error('Admin notification failed:', error);
    return false;
  }
}

/**
 * Notify about sync result
 */
export async function notifySyncResult(result: {
  synced: number;
  processed: number;
  published: number;
  duration: number;
}): Promise<void> {
  const message = `📥 <b>Sync Complete</b>

• Synced: ${result.synced} articles
• Processed: ${result.processed}
• Published: ${result.published}
• Duration: ${result.duration}ms`;

  await notifyAdmin(message, result.published > 0 ? 'success' : 'info');
}

/**
 * Notify about telegram post
 */
export async function notifyTelegramPost(result: {
  posted: boolean;
  articleTitle?: string;
  articleUrl?: string;
  reason?: string;
}): Promise<void> {
  if (result.posted) {
    await notifyAdmin(
      `📱 <b>Telegram Post</b>\n\n"${result.articleTitle}"\n\n🔗 <a href="${result.articleUrl}">Maqolani ko'rish</a>`,
      'success'
    );
  } else {
    await notifyAdmin(
      `📭 <b>Telegram Skip</b>\n\n${result.reason}`,
      'info'
    );
  }
}

/**
 * Notify about error
 */
export async function notifyError(
  operation: string,
  error: string
): Promise<void> {
  await notifyAdmin(
    `<b>${operation}</b>\n\n${error}`,
    'error'
  );
}
