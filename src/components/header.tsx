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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-foreground/5 shadow-sm py-2"
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-2xl font-serif font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
        >
          Antigravity.
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
