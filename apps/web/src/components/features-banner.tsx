/**
 * Features Banner Component
 * 
 * Compact CTA section showcasing platform features
 * Displayed on homepage below hero section
 * 
 * @author Antigravity Team
 */

import Link from 'next/link';
import { 
  Send, 
  Bell, 
  Sparkles,
  Bot,
  ArrowRight,
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config/social';

const features = [
  {
    icon: Send,
    title: 'Telegram Kanal',
    description: "Eng so'nggi yangiliklar to'g'ridan-to'g'ri telegramga",
    href: SITE_CONFIG.social.telegram.channel,
    external: true,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
  },
  {
    icon: Bot,
    title: 'Mini App',
    description: "Telegram ichida qulay o'qish tajribasi",
    href: SITE_CONFIG.social.telegram.bot,
    external: true,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
  },
  {
    icon: Bell,
    title: 'Bildirishnomalar',
    description: "Muhim yangiliklar haqida darhol xabar",
    href: '/features#notifications',
    external: false,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10 hover:bg-orange-500/20',
  },
  {
    icon: Sparkles,
    title: 'AI Tahlil',
    description: "Sun'iy intellekt bilan tahlil qilingan maqolalar",
    href: '/features#ai',
    external: false,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20',
  },
];

export function FeaturesBanner({ className = '' }: { className?: string }) {
  return (
    <section className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/70">
          Imkoniyatlar
        </h2>
        <Link 
          href="/features" 
          className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          Barchasi
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      
      {/* Feature Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          const Component = feature.external ? 'a' : Link;
          const props = feature.external 
            ? { target: '_blank', rel: 'noopener noreferrer' } 
            : {};
          
          return (
            <Component
              key={feature.title}
              href={feature.href}
              {...props}
              className={`group p-4 rounded-xl border border-foreground/5 ${feature.bgColor} transition-all`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${feature.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm mb-1 group-hover:text-foreground transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {feature.description}
              </p>
            </Component>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Compact inline version for sidebar
 */
export function FeaturesCompact({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70 mb-3">
        Imkoniyatlar
      </h3>
      {features.slice(0, 3).map((feature) => {
        const Icon = feature.icon;
        return (
          <a
            key={feature.title}
            href={feature.href}
            target={feature.external ? '_blank' : undefined}
            rel={feature.external ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-foreground/5 transition-colors group"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${feature.bgColor} ${feature.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium group-hover:text-foreground transition-colors">
                {feature.title}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {feature.description}
              </p>
            </div>
          </a>
        );
      })}
      <Link 
        href="/features" 
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors pt-1"
      >
        Barcha imkoniyatlar
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
