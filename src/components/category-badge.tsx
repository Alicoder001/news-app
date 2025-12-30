'use client';

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
    <span
      className={`${sizeClasses[size]} font-bold uppercase tracking-widest rounded-full border bg-opacity-10`}
      style={{
        color: category.color || '#3b82f6',
        backgroundColor: `${category.color || '#3b82f6'}10`,
        borderColor: `${category.color || '#3b82f6'}20`,
      }}
    >
      {category.name}
    </span>
  );
}
