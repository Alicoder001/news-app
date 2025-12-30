import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Folder, Lightbulb, Check } from 'lucide-react';

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { articles: true },
      },
    },
  });
}

export async function CategorySidebar() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Folder className="w-5 h-5" /> Kategoriyalar
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-2">
                {category.icon && <span className="text-xl">{category.icon}</span>}
                <span className="font-medium group-hover:text-blue-400 transition-colors">
                  {category.name}
                </span>
              </div>
              <span className="text-xs text-foreground/40">
                {category._count.articles}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" /> Platforma haqida
        </h3>
        <p className="text-sm text-foreground/70 leading-relaxed mb-4">
          Biz IT yangiliklarini faqat tarjima qilmaymiz - tushuntiramiz. 
          Har bir yangilik kontekst va tahlil bilan.
        </p>
        <div className="flex flex-col gap-2 text-xs text-foreground/60">
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5" /> AI-powered tahlil
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5" /> Ishonchli manbalar
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5" /> O'zbek tilida
          </div>
        </div>
      </div>
    </div>
  );
}
