'use client';

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b border-transparent",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-border/40 shadow-sm py-3"
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link 
            href="/" 
            className="text-2xl font-serif font-black tracking-tight text-foreground hover:opacity-80 transition-opacity"
          >
            Antigravity.
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">News</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Analysis</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Podcasts</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
           {/* Placeholder for Search or other actions */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
