'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './theme-toggle';
import { cn } from './cn';

/**
 * Site header ported from legacy/apps/web widgets/layout-header.
 * Simplified: no i18n, links target existing routes (slugs/URLs unchanged).
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b border-transparent',
        scrolled ? 'bg-background/80 backdrop-blur-xl border-border/40 shadow-sm py-2' : 'bg-transparent py-2',
      )}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-serif font-black tracking-tight text-foreground hover:opacity-80 transition-opacity">
            ai_shunos.
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/articles" className="hover:text-foreground transition-colors">
              Latest
            </Link>
            <Link href="/articles" className="hover:text-foreground transition-colors">
              Analysis
            </Link>
            <Link href="/tg" className="hover:text-foreground transition-colors">
              Mini App
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/articles"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-foreground text-background hover:opacity-85 transition-opacity"
          >
            Read news
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
