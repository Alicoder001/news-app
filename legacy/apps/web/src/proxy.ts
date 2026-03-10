import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // API va static fayllarni exclude qilamiz
  // - /api, /trpc, /_next, /_vercel bilan boshlanadigan pathlar
  // - nuqta (.) bor pathlar (static fayllar: favicon.ico, robots.txt va h.k.)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
