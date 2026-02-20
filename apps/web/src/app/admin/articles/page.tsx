import Link from 'next/link';
import { Search, Filter, Edit2, Eye } from 'lucide-react';
import { DeleteArticleButton } from './delete-article-button';
import { getAdminArticles } from '@/lib/api/server-api';

async function getArticles(page: number = 1, limit: number = 20) {
  const response = await getAdminArticles(page, limit);
  const data = response.data as {
    articles: Array<{
      id: string;
      slug: string;
      title: string;
      viewCount: number;
      createdAt: string;
      category?: { name?: string } | null;
      rawArticle?: { source?: { name?: string } | null } | null;
    }>;
    pagination: { total: number; totalPages: number };
  };
  return {
    articles: data.articles,
    total: data.pagination.total,
    pages: data.pagination.totalPages,
  };
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const { articles, total, pages } = await getArticles(page);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold">Maqolalar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total} ta maqola
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-foreground/10 text-sm font-medium hover:bg-foreground/5 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Maqola qidirish..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-foreground/5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-foreground/[0.02]">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Sarlavha
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Kategoriya
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Manba
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ko'rishlar
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Sana
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-foreground/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <p className="text-sm font-medium truncate">{article.title}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      /{article.slug}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {article.category ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-foreground/5">
                      {article.category.name}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-muted-foreground">
                    {article.rawArticle?.source?.name || 'Nomaʼlum'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm">{article.viewCount}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.createdAt).toLocaleDateString('uz-UZ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/articles/${article.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                      title="Ko'rish"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <DeleteArticleButton 
                      articleId={article.id} 
                      articleTitle={article.title} 
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/articles?page=${p}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-foreground text-background'
                  : 'hover:bg-foreground/5'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
