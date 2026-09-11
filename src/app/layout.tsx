import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/header';
import { SiteFooter } from '@/components/footer';
import { NeonOrbs } from '@/components/neon-orbs';
import { TechPattern } from '@/components/tech-pattern';

export const metadata: Metadata = {
  title: 'ai_shunos | AI Powered Tech Media',
  description: 'AI news, verified — Uzbek tech coverage',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen relative text-foreground transition-colors duration-500 flex flex-col bg-background">
            <NeonOrbs />
            <TechPattern />
            <SiteHeader />
            <main className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-4 pt-16 flex-1 w-full">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
