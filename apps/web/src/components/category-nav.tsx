import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { CategoryNavClient } from './category-nav-client';

export async function CategoryNav() {
  const t = await getTranslations('common');
  
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

  return <CategoryNavClient categories={categories} homeLabel={t('home')} />;
}
