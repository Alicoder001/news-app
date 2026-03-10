/**
 * Development Cron Scheduler
 * 
 * Faqat development rejimda ishlaydi.
 * Next.js instrumentation orqali avtomatik ishga tushadi.
 */

let isSchedulerRunning = false;

export function startDevCronScheduler() {
  // Faqat development rejimda
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  // Ikki marta ishga tushmasligi uchun
  if (isSchedulerRunning) {
    return;
  }
  
  isSchedulerRunning = true;
  console.log('🕐 Dev Cron Scheduler started');
  
  const baseUrl = 'http://localhost:3000';
  const cronSecret = process.env.CRON_SECRET;
  const headers: HeadersInit = cronSecret 
    ? { Authorization: `Bearer ${cronSecret}` } 
    : {};
  
  // Sync + Process: Har 30 sekundda (TEST uchun)
  setInterval(async () => {
    console.log('⏰ [DEV CRON] Running news sync...');
    try {
      const res = await fetch(`${baseUrl}/api/cron/news`, { headers });
      const data = await res.json();
      console.log('📥 Sync result:', data.success ? '✅' : '❌', data.message || '');
    } catch (error) {
      console.error('❌ Sync failed:', error);
    }
  }, 30 * 1000); // 30 sekund (TEST)
  
  // Telegram: Har 1 daqiqada (TEST uchun)
  setInterval(async () => {
    console.log('⏰ [DEV CRON] Running telegram post...');
    try {
      const res = await fetch(`${baseUrl}/api/cron/telegram`, { headers });
      const data = await res.json();
      console.log('📱 Telegram result:', data.success ? '✅' : '❌', data.message || '');
    } catch (error) {
      console.error('❌ Telegram failed:', error);
    }
  }, 60 * 1000); // 1 daqiqa (TEST)
  
  console.log('📅 Schedules (TEST MODE):');
  console.log('   - News sync: every 30 seconds');
  console.log('   - Telegram: every 1 minute');
}
