import Link from 'next/link';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
}

const ACCENT = '#3b82f6';

/**
 * Category badge ported from legacy/apps/web components/category-badge.
 * Current schema stores category as a plain string, so color is fixed accent.
 */
export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <Link
      href={`/categories/${encodeURIComponent(category)}`}
      className={`${sizeClasses[size]} font-bold uppercase tracking-[0.15em] rounded-sm border border-white/10 backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-[0_0_12px_-2px_currentColor]`}
      style={{
        color: ACCENT,
        backgroundColor: `${ACCENT}15`,
        borderColor: `${ACCENT}30`,
      }}
    >
      {category}
    </Link>
  );
}

interface TagBadgeProps {
  tag: string;
  size?: 'sm' | 'md';
  variant?: 'default' | 'subtle';
}

export function TagBadge({ tag, size = 'sm', variant = 'subtle' }: TagBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  const variantClasses = {
    default: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    subtle: 'bg-white/5 text-foreground/60 border-white/10',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium border ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      #{tag}
    </span>
  );
}

export function CountBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-foreground/5 border border-foreground/10 text-foreground/60">
      {count}
    </span>
  );
}
