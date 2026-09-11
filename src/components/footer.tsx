import Link from 'next/link';
import { Send, Mail, MapPin, Heart, ExternalLink } from 'lucide-react';

/**
 * Site footer ported from legacy/apps/web widgets/layout-footer.
 * Links target existing routes only so slugs/URLs stay identical.
 */
export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: '/', label: 'Bosh sahifa' },
    { href: '/articles', label: 'Latest articles' },
    { href: '/tg', label: 'Mini App view' },
  ];

  const categoryLinks = [
    { href: '/articles', label: 'All stories' },
    { href: '/articles', label: 'Analysis' },
    { href: '/tg', label: 'Telegram' },
  ];

  return (
    <footer className="relative mt-20 border-t border-foreground/5 bg-foreground/[0.02]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="text-xl font-bold tracking-tight">
                ai_shunos<span className="text-blue-500">.</span>
              </h2>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI news, verified. Sun&apos;iy intellekt yordamida tayyorlangan ishonchli texnologiya yangiliklari.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70">Bo&apos;limlar</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70">Kompaniya</h3>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70">Biz bilan bog&apos;laning</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                via Telegram Mini App
              </span>
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                @ai_shunos
              </span>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Toshkent, O&apos;zbekiston
              </p>
            </div>

            <Link
              href="/tg"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors"
            >
              <Send className="w-4 h-4" />
              Mini App view
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-foreground/5">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground text-center md:text-left">© {currentYear} ai_shunos. Barcha huquqlar himoyalangan.</p>
            <p className="text-xs text-muted-foreground/50 hidden lg:flex items-center gap-1">
              O&apos;zbekistonda <Heart className="w-3 h-3 text-red-500 fill-red-500" /> bilan yaratilgan
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
