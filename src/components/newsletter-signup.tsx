'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function NewsletterSignup() {
  const t = useTranslations('home.newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center space-y-3">
        <div className="flex justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
        </div>
        <p className="text-sm font-medium text-emerald-500/80">✓</p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-[10px] uppercase tracking-widest font-bold text-emerald-500/40 hover:text-emerald-500/60"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <section className="glass-card p-8 rounded-2xl">
      <h3 className="text-lg font-medium mb-2">{t('title')}</h3>
      <p className="text-xs text-foreground/50 mb-6 leading-relaxed">
        {t('description')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder={t('placeholder')}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06] focus:border-primary/20 focus:outline-none transition-all text-sm"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-foreground text-background font-bold text-[11px] uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? '...' : t('button')}
        </button>
      </form>
    </section>
  );
}
