import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config/social';

export const metadata: Metadata = {
  title: `Bog'lanish | ${SITE_CONFIG.name}`,
  description: "Antigravity jamoasi bilan bog'laning. Savollar, takliflar va hamkorlik uchun.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">
        Bog&apos;lanish
      </h1>
      
      <div className="prose prose-lg prose-headings:font-serif max-w-none space-y-8 text-foreground/80">
        <p className="lead text-xl leading-relaxed">
          Biz bilan bog&apos;lanish uchun quyidagi kanallardan foydalanishingiz mumkin.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
          {/* Email Card */}
          <a 
            href={`mailto:${SITE_CONFIG.email}`}
            className="p-6 rounded-xl border border-foreground/10 hover:border-foreground/20 hover:bg-foreground/[0.02] transition-all group"
          >
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-bold text-lg mb-1">Email</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Rasmiy murojaatlar uchun
            </p>
            <p className="text-blue-500 group-hover:underline">
              {SITE_CONFIG.email}
            </p>
          </a>

          {/* Telegram Card */}
          <a 
            href={SITE_CONFIG.social.telegram.channel}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-xl border border-foreground/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
          >
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-bold text-lg mb-1">Telegram</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Tezkor aloqa uchun
            </p>
            <p className="text-blue-500 group-hover:underline">
              {SITE_CONFIG.social.telegram.username}
            </p>
          </a>

          {/* Twitter Card */}
          <a 
            href={SITE_CONFIG.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-xl border border-foreground/10 hover:border-foreground/20 hover:bg-foreground/[0.02] transition-all group"
          >
            <div className="text-3xl mb-3">𝕏</div>
            <h3 className="font-bold text-lg mb-1">Twitter / X</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Qisqa yangiliklar uchun
            </p>
            <p className="text-foreground/70 group-hover:underline">
              @antigravity_uz
            </p>
          </a>

          {/* Instagram Card */}
          <a 
            href={SITE_CONFIG.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-xl border border-foreground/10 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all group"
          >
            <div className="text-3xl mb-3">📷</div>
            <h3 className="font-bold text-lg mb-1">Instagram</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Vizual kontent uchun
            </p>
            <p className="text-pink-500 group-hover:underline">
              @antigravity_uz
            </p>
          </a>
        </div>

        <section>
          <h2>Hamkorlik</h2>
          <p>
            Reklama yoki hamkorlik takliflari uchun bizga email orqali yozing. 
            Biz sizning takliflaringizni ko&apos;rib chiqishdan mamnun bo&apos;lamiz.
          </p>
        </section>

        <section>
          <h2>Mualliflik uchun</h2>
          <p>
            Agar siz IT sohasida ekspert bo&apos;lsangiz va bizning platformamizda maqola 
            yozmoqchi bo&apos;lsangiz, portfolio bilan birga bizga murojaat qiling.
          </p>
        </section>
      </div>
    </div>
  );
}
