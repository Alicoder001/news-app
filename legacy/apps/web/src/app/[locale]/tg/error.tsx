'use client';

import { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TGError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('TG Page Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-foreground/5 px-6 py-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.history.back()}
            className="p-1.5 -ml-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-serif font-bold">Xatolik</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="space-y-6 text-center max-w-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-xl">😔</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-serif font-bold">
              Nimadir xato ketdi
            </h2>
            <p className="text-sm text-muted-foreground">
              Sahifani yuklashda xatolik yuz berdi. Qayta urinib ko'ring.
            </p>
          </div>

          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-foreground text-background text-sm font-medium rounded-xl hover:bg-foreground/90 transition-colors"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    </div>
  );
}
