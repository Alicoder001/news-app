'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useMiniAppStore } from '@/stores/mini-app.store';

type MiniArticle = {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortSummary?: string | null;
};

export function MiniAppShell({ articles }: { articles: MiniArticle[] }) {
  const {
    activeCategory,
    setActiveCategory,
    compactMode,
    setCompactMode,
    savedIds,
    toggleSaved,
  } = useMiniAppStore();

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(articles.map((article) => article.category)))],
    [articles],
  );

  const filtered = activeCategory === 'all'
    ? articles
    : articles.filter((article) => article.category === activeCategory);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <section style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Preferences</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <input type="checkbox" checked={compactMode} onChange={(event) => setCompactMode(event.target.checked)} />
          Compact cards
        </label>
      </section>

      <section style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: 999,
              padding: '8px 12px',
              background: activeCategory === category ? '#111827' : '#ffffff',
              color: activeCategory === category ? '#ffffff' : '#111827',
            }}
          >
            {category}
          </button>
        ))}
      </section>

      <div style={{ display: 'grid', gap: 12 }}>
        {filtered.map((article) => {
          const saved = savedIds.includes(article.id);

          return (
            <div
              key={article.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 14,
                padding: compactMode ? 12 : 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <Link href={`/tg/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{article.category}</div>
                  <strong>{article.title}</strong>
                  {!compactMode && article.shortSummary && (
                    <p style={{ marginTop: 8, color: '#4b5563' }}>{article.shortSummary}</p>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => toggleSaved(article.id)}
                  style={{ border: '1px solid #d1d5db', borderRadius: 10, padding: '8px 10px', background: saved ? '#111827' : '#ffffff', color: saved ? '#ffffff' : '#111827', height: 'fit-content' }}
                >
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p>No articles match this category yet.</p>}
      </div>
    </div>
  );
}
