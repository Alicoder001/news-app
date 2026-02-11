'use client';

import { Link } from '@/i18n/navigation';

interface CategoryBadgeProps {
  category: {
    name: string;
    slug: string;
    color?: string | null;
  };
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <Link
      href={`/category/${category.slug}`}
      className={`${sizeClasses[size]} font-bold uppercase tracking-[0.15em] rounded-sm border border-white/10
                 backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-300
                 hover:shadow-[0_0_12px_-2px_currentColor]`}
      style={{
        color: category.color || '#3b82f6',
        backgroundColor: `${category.color || '#3b82f6'}15`,
        borderColor: `${category.color || '#3b82f6'}30`,
      }}
    >
      {category.name}
    </Link>
  );
}
