import { getTranslations } from 'next-intl/server';
import { CategoryNavClient } from './category-nav-client';
import { getTopCategories } from '@/lib/api/server-api';

export async function CategoryNav() {
  const t = await getTranslations('common');
  const response = await getTopCategories(8);
  const categories = (response.data.categories as Array<{
    id: string;
    name: string;
    slug: string;
    color?: string | null;
  }>) ?? [];

  return <CategoryNavClient categories={categories} homeLabel={t('home')} />;
}
