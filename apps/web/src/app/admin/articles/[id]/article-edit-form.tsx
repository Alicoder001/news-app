"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Trash2, Send, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

interface ArticleEditFormProps {
  article: {
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
  categories: Category[];
}

export function ArticleEditForm({ article, categories }: ArticleEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: article.title,
    slug: article.slug,
    summary: article.summary || '',
    content: article.content,
    imageUrl: article.imageUrl || '',
    categoryId: article.categoryId || '',
    difficulty: (article.difficulty || 'INTERMEDIATE').toLowerCase(),
    importance: (article.importance || 'MEDIUM').toLowerCase(),
    readingTime: article.readingTime || 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || error.error || 'Xatolik yuz berdi');
      }

      setMessage({ type: 'success', text: 'Maqola muvaffaqiyatli yangilandi!' });
      router.refresh();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Xatolik yuz berdi' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Rostdan ham bu maqolani o\'chirmoqchimisiz?')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('O\'chirishda xatolik');

      router.push('/admin/articles');
      router.refresh();
    } catch {
      setMessage({ type: 'error', text: 'O\'chirishda xatolik yuz berdi' });
      setIsDeleting(false);
    }
  };

  const handleSendToTelegram = async () => {
    if (!confirm('Bu maqolani Telegram kanalga qayta yubormoqchimisiz?')) return;
    
    setIsSendingTelegram(true);
    try {
      const res = await fetch(`/api/admin/articles/${article.id}/telegram`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Telegram\'ga yuborishda xatolik');

      setMessage({ type: 'success', text: 'Telegram kanalga yuborildi!' });
    } catch {
      setMessage({ type: 'error', text: 'Telegram\'ga yuborishda xatolik' });
    } finally {
      setIsSendingTelegram(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
            : 'bg-red-500/10 text-red-600 border border-red-500/20'
        }`}>
          {message.text}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">Sarlavha</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:outline-none focus:ring-2 focus:ring-foreground/20"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium mb-2">Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:outline-none focus:ring-2 focus:ring-foreground/20"
          required
        />
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium mb-2">Qisqa tavsif</label>
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium mb-2">Kontent (HTML)</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={12}
          className="w-full px-4 py-2.5 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:outline-none focus:ring-2 focus:ring-foreground/20 font-mono text-sm resize-y"
          required
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium mb-2">Rasm URL</label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      {/* Grid: Category, Difficulty, Importance, Reading Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Kategoriya</label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="">Kategoriyasiz</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Qiyinchilik</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="beginner">Boshlang'ich</option>
            <option value="intermediate">O'rta</option>
            <option value="advanced">Murakkab</option>
            <option value="expert">Ekspert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Muhimlik</label>
          <select
            value={formData.importance}
            onChange={(e) => setFormData({ ...formData, importance: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="low">Past</option>
            <option value="medium">O'rta</option>
            <option value="high">Yuqori</option>
            <option value="critical">Juda muhim</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">O'qish vaqti (min)</label>
          <input
            type="number"
            min="1"
            max="60"
            value={formData.readingTime}
            onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) || 5 })}
            className="w-full px-4 py-2.5 rounded-lg border border-foreground/10 bg-foreground/[0.02] focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-foreground/5">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-500/10 transition-colors disabled:opacity-50"
        >
          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          O'chirish
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSendToTelegram}
            disabled={isSendingTelegram}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors disabled:opacity-50"
          >
            {isSendingTelegram ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Telegram'ga yuborish
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Saqlash
          </button>
        </div>
      </div>
    </form>
  );
}
