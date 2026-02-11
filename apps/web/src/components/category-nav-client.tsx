'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
}

interface CategoryNavClientProps {
  categories: Category[];
  homeLabel: string;
}

export function CategoryNavClient({ categories, homeLabel }: CategoryNavClientProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkBaseClass = "shrink-0 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 rounded-sm border whitespace-nowrap";

  return (
    <nav className="w-full sticky top-[56px] z-40 mb-2 py-1 overflow-hidden pointer-events-none">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 scroll-smooth pointer-events-auto">
        <Link 
            href="/"
            className={cn(
              linkBaseClass,
              scrolled 
                ? "bg-background/60 backdrop-blur-md border-foreground/10 text-foreground" 
                : "bg-foreground/5 border-foreground/10 text-foreground hover:bg-foreground/10"
            )}
        >
            {homeLabel}
        </Link>
        
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className={cn(
              linkBaseClass,
              scrolled
                ? "bg-background/60 backdrop-blur-md text-foreground border-foreground/10 hover:border-foreground/30"
                : "bg-foreground/5 text-foreground/70 hover:text-foreground border-foreground/5 hover:border-foreground/15 hover:bg-foreground/10"
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
