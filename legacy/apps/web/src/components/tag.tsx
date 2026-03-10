'use client';

import { Link } from '@/i18n/navigation';

interface TagProps {
  tag: {
    name: string;
    slug: string;
  };
  size?: 'sm' | 'md';
  variant?: 'default' | 'subtle';
  href?: string;
}

export function Tag({ tag, size = 'sm', variant = 'default', href }: TagProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  const variantClasses = {
    default: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    subtle: 'bg-white/5 text-foreground/60 border-white/10',
  };

  const finalHref = href || `/tag/${tag.slug}`;

  return (
    <Link
      href={finalHref}
      className={`
        inline-flex items-center
        rounded-md font-medium border
        hover:bg-opacity-30 transition-colors cursor-pointer
        ${sizeClasses[size]}
        ${variantClasses[variant]}
      `}
    >
      #{tag.name}
    </Link>
  );
}
