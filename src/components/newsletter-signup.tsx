'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
        <h3 className="font-bold text-lg mb-2">Muvaffaqiyat!</h3>
        <p className="text-sm text-foreground/70">
          Obunangiz tasdiqlandi. Yangiliklarni emailingizga yuboramiz!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
      <div className="text-center mb-4">
        <Mail className="w-10 h-10 mx-auto mb-2 text-blue-400" />
        <h3 className="text-lg font-bold mb-2">Newsletter</h3>
        <p className="text-sm text-foreground/70">
          Haftalik eng muhim yangiliklarni emailda oling
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email manzilingiz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {status === 'loading' ? 'Yuborilmoqda...' : "Obuna bo'lish"}
        </button>
        {status === 'error' && (
          <p className="text-sm text-red-400 text-center">
            Xatolik yuz berdi. Qayta urinib ko'ring.
          </p>
        )}
      </form>
    </div>
  );
}
