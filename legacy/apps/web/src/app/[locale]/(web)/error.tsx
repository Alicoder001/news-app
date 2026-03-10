'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console (in production, send to error tracking service)
    console.error('Page Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="space-y-6 max-w-md">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-foreground">
            Xatolik yuz berdi
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sahifani yuklashda muammo bo'ldi. Iltimos, qayta urinib ko'ring.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 transition-colors"
          >
            Qayta urinish
          </button>
          <a
            href="/"
            className="px-6 py-2.5 border border-foreground/10 text-foreground text-sm font-medium rounded-lg hover:bg-foreground/5 transition-colors"
          >
            Bosh sahifaga qaytish
          </a>
        </div>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
              Texnik ma'lumotlar
            </summary>
            <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-40">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
