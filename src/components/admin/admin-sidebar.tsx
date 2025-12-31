'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Rss, 
  Activity, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/articles', label: 'Maqolalar', icon: FileText },
  { href: '/admin/sources', label: 'Manbalar', icon: Rss },
  { href: '/admin/pipeline', label: 'Pipeline', icon: Activity },
  { href: '/admin/usage', label: 'AI Sarfi', icon: BarChart3 },
  { href: '/admin/settings', label: 'Sozlamalar', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-background border-r border-foreground/5">
      {/* Header */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-foreground/5">
        <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-sm">
          A
        </div>
        <div>
          <h1 className="font-serif font-bold text-sm">Antigravity</h1>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-foreground/5">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Saytga qaytish
        </Link>
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Chiqish
          </button>
        </form>
      </div>
    </aside>
  );
}
