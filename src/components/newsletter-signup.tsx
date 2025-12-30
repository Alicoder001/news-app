'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react'; // Success indicator is fine, it's functional

export function NewsletterSignup() {
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
        <p className="text-sm font-medium text-emerald-500/80">Rahmat! Obuna bo'ldingiz.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-[10px] uppercase tracking-widest font-bold text-emerald-500/40 hover:text-emerald-500/60"
        >
          Yana qo'shish
        </button>
      </div>
    );
  }

  return (
    <section className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
      <h3 className="text-lg font-medium mb-2">Newsletter</h3>
      <p className="text-xs text-foreground/50 mb-6 leading-relaxed">
        Haftalik eng muhim tahliliy maqolalarni birinchilardan bo'lib oling.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email manzilingiz"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/30 focus:outline-none transition-all text-sm"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-foreground text-background font-bold text-[11px] uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Yozilmoqda...' : 'Obuna bo\'lish'}
        </button>
      </form>
    </section>
  );
}
