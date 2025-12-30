import prisma from '@/lib/prisma';
import Link from 'next/link';

export async function CategorySidebar() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { articles: true }
      }
    },
    orderBy: {
      articles: { _count: 'desc' }
    }
  });

  return (
    <div className="space-y-10">
      {/* Categories */}
      <section>
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 mb-6">
        Trending Now
      </h3>
        <div className="space-y-1">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group flex items-center justify-between py-2.5 px-4 rounded-xl hover:bg-muted/50 transition-all duration-300 text-sm border border-transparent hover:border-border/50"
            >
              <span className="text-xl font-light text-foreground/10 group-hover:text-foreground/20 transition-colors font-serif italic w-6 text-center">
                {index + 1}
              </span>
              <span className="text-[10px] font-mono text-foreground/30 group-hover:text-foreground/50">
                {String(category._count.articles).padStart(2, '0')}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* About Platform */}
      <section className="glass-card p-6 rounded-2xl">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-4">
          Platforma Haqida
        </h3>
        <p className="text-sm text-foreground/60 leading-relaxed mb-4">
          Biz axborot shovqinini filtrlab, sizga faqat eng muhim va tahliliy yangiliklarni yetkazamiz. Har bir maqola AI yordamida chuqur tahlil qilinadi.
        </p>
        <div className="space-y-2">
          {['Tahliliy yondashuv', 'Tasdiqlangan manbalar', "O'zbek tilida"].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-[11px] text-foreground/40">
              <span className="w-1 h-1 rounded-full bg-foreground/20" />
              {feature}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
