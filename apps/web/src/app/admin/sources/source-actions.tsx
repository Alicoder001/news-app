"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2, Power } from 'lucide-react';

interface SourceActionsProps {
  sourceId: string;
  sourceName: string;
  isActive: boolean;
}

export function SourceActions({ sourceId, sourceName, isActive }: SourceActionsProps) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const res = await fetch(`/api/admin/sources/${sourceId}`, { method: 'PATCH' });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      alert('Xatolik yuz berdi');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`"${sourceName}" manbasini o'chirmoqchimisiz?`)) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/sources/${sourceId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      alert('O\'chirishda xatolik');
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={isToggling}
        className={`p-2 rounded-lg transition-colors ${isActive ? 'text-green-500 hover:bg-green-500/10' : 'text-muted-foreground hover:bg-foreground/5'}`}
        title={isActive ? "O'chirish" : "Yoqish"}
      >
        {isToggling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        title="O'chirish"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
}