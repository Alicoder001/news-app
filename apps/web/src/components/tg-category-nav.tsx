import Link from 'next/link';
import { getTopCategories } from '@/lib/api/server-api';

export async function TGCategoryNav() {
  const response = await getTopCategories(8);
  const categories = (response.data.categories as Array<{
    id: string;
    name: string;
    slug: string;
  }>) ?? [];

  return (
    <nav className="w-full border-b border-foreground/5 bg-background/50 backdrop-blur-sm sticky top-[76px] z-20 mb-6">
      <div className="flex items-center gap-1 overflow-x-auto py-2 px-8 no-scrollbar mask-gradient-x">
        <Link 
            href="/tg"
            className="shrink-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground hover:bg-foreground/5 rounded-full transition-colors border border-transparent hover:border-foreground/10"
        >
            Barchasi
        </Link>
        <div className="w-px h-3 bg-foreground/10 mx-1 shrink-0" />
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/tg/category/${category.slug}`}
            className="shrink-0 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-full transition-colors whitespace-nowrap border border-transparent hover:border-foreground/10"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
