'use client';

interface CategoryBadgeProps {
  category: {
    name: string;
    slug: string;
    icon?: string | null;
    color?: string | null;
  };
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function CategoryBadge({ 
  category, 
  size = 'md',
  showIcon = true 
}: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 
        rounded-full font-medium
        bg-white/5 border border-white/10
        hover:bg-white/10 transition-colors
        ${sizeClasses[size]}
      `}
      style={{
        borderColor: category.color ? `${category.color}20` : undefined,
        backgroundColor: category.color ? `${category.color}10` : undefined,
      }}
    >
      {showIcon && category.icon && (
        <span className="text-base leading-none">{category.icon}</span>
      )}
      <span>{category.name}</span>
    </span>
  );
}
