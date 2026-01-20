import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ArticleEditForm } from './article-edit-form';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

async function getArticle(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: true,
      tags: true,
      rawArticle: {
        include: { source: true },
      },
    },
  });
  return article;
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
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