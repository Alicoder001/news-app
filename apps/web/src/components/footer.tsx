'use client';

/**
 * Professional Footer Component with Lucide Icons
 * 
 * @author Antigravity Team
 */

import Link from 'next/link';
import { 
  Send, 
  Mail, 
  MapPin,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { SocialLinks } from './social-links';
import { SITE_CONFIG } from '@/lib/config/social';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: '/', label: 'Bosh sahifa' },
    { href: '/category/ai', label: "Sun'iy intellekt" },
    { href: '/category/programming', label: 'Dasturlash' },
    { href: '/category/security', label: 'Kiberhavfsizlik' },
    { href: '/category/startup', label: 'Startaplar' },
  ];

  const legalLinks = [
    { href: '/privacy', label: 'Maxfiylik siyosati' },
    { href: '/terms', label: 'Foydalanish shartlari' },
    { href: '/about', label: 'Biz haqimizda' },
    { href: '/contact', label: "Bog'lanish" },
    { href: '/features', label: "Imkoniyatlar" },
  ];

  return (
    <footer className="relative mt-20 border-t border-foreground/5 bg-foreground/[0.02]">
      {/* Main Footer Content */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="text-xl font-bold tracking-tight">
                {SITE_CONFIG.name}<span className="text-blue-500">.</span>
              </h2>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {SITE_CONFIG.tagline}. Sun&apos;iy intellekt yordamida tayyorlangan ishonchli texnologiya yangiliklari.
            </p>
            
            {/* Social Links */}
            <div className="pt-2">
              <SocialLinks />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70">
              Bo&apos;limlar
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Company Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70">
              Kompaniya
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70">
              Biz bilan bog&apos;laning
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <a 
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                {SITE_CONFIG.email}
              </a>
              <a 
                href={SITE_CONFIG.social.telegram.channel}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Send className="w-4 h-4" />
                {SITE_CONFIG.social.telegram.username}
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Toshkent, O&apos;zbekiston
              </p>
            </div>
            
            {/* Telegram CTA */}
            <a
              href={SITE_CONFIG.social.telegram.channel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors"
            >
              <Send className="w-4 h-4" />
              Telegram kanalga obuna
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-foreground/5">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-muted-foreground text-center md:text-left">
              © {currentYear} {SITE_CONFIG.name}. Barcha huquqlar himoyalangan.
            </p>
            
            {/* Legal Links (compact) */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Maxfiylik
              </Link>
              <span className="text-foreground/20">•</span>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Shartlar
              </Link>
              <span className="text-foreground/20">•</span>
              <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
                Sitemap
              </Link>
            </div>

            {/* Made with love */}
            <p className="text-xs text-muted-foreground/50 hidden lg:flex items-center gap-1">
              O&apos;zbekistonda <Heart className="w-3 h-3 text-red-500 fill-red-500" /> bilan yaratilgan
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
