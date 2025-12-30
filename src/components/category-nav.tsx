import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Category } from '@prisma/client';

export async function CategoryNav() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { articles: true },
      },
    },
    orderBy: {
      articles: {
        _count: 'desc',
      },
    },
    take: 8,
  });

  return (
    <nav className="w-full border-b border-foreground/5 bg-background/50 backdrop-blur-sm sticky top-[60px] z-40 mb-6">
      <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar mask-gradient-x">
        <Link 
            href="/"
            className="shrink-0 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground hover:bg-foreground/5 rounded-full transition-colors"
        >
            Bosh sahifa
        </Link>
        <div className="w-px h-3 bg-foreground/10 mx-1 shrink-0" />
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="shrink-0 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-full transition-colors whitespace-nowrap"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
