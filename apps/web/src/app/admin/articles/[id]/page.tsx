import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ArticleEditForm } from './article-edit-form';
import { getAdminArticleById, getCategories as fetchCategories } from '@/lib/api/server-api';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

async function getArticle(id: string) {
  try {
    const response = await getAdminArticleById(id);
    return response.data.article as {
      id: string;
      title: string;
      slug: string;
      summary: string | null;
      content: string;
      imageUrl: string | null;
      categoryId: string | null;
      difficulty: string | null;
      importance: string | null;
      readingTime: number | null;
    };
  } catch {
    return null;
  }
}

async function getCategories() {
  const response = await fetchCategories();
  return (response.data.categories as Array<{
    id: string;
    name: string;
    slug: string;
    color: string | null;
  }>) ?? [];
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    getArticle(id),
    getCategories(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Maqolalarga qaytish
        </Link>
        <h1 className="text-2xl font-serif font-bold">Maqolani tahrirlash</h1>
        <p className="text-sm text-muted-foreground mt-1">
          ID: {article.id}
        </p>
      </div>

      <ArticleEditForm article={article} categories={categories} />
    </div>
  );
}
