import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware navigation API eksportlari
// Bu hooklar avtomatik ravishda locale'ni hisobga oladi
export const { 
  Link,           // <Link href="/about"> -> /uz/about yoki /ru/about
  redirect,       // redirect('/about') -> /uz/about yoki /ru/about  
  usePathname,    // locale prefix'siz pathname qaytaradi
  useRouter,      // locale-aware router
  getPathname     // server-side pathname helper
} = createNavigation(routing);
