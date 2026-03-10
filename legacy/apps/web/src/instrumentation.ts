/**
 * Next.js Instrumentation
 * 
 * Server startup'da bir marta chaqiriladi.
 * Dev cron schedulerni shu yerda ishga tushiramiz.
 */

export async function register() {
  // Faqat server-side va development
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
    // Dynamic import to avoid bundling issues
    const { startDevCronScheduler } = await import('./lib/dev-cron');
    
    // 5 sekund kutamiz - server to'liq ishga tushguncha
    setTimeout(() => {
      startDevCronScheduler();
    }, 5000);
  }
}
