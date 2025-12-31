/**
 * Social Media Links Component with Lucide Icons
 * 
 * Footer social media profile links
 * 
 * @author Antigravity Team
 */

import { 
  Send, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Github,
  Twitter,
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config/social';

interface SocialLinksProps {
  className?: string;
  showLabels?: boolean;
}

const socialLinks = [
  { 
    name: 'Telegram', 
    href: SITE_CONFIG.social.telegram.channel, 
    icon: Send,
    ariaLabel: "Telegram kanalimizga qo'shiling",
    hoverColor: 'hover:text-blue-500 hover:border-blue-500/30',
  },
  { 
    name: 'Instagram', 
    href: SITE_CONFIG.social.instagram, 
    icon: Instagram,
    ariaLabel: "Instagramda kuzating",
    hoverColor: 'hover:text-pink-500 hover:border-pink-500/30',
  },
  { 
    name: 'Facebook', 
    href: SITE_CONFIG.social.facebook, 
    icon: Facebook,
    ariaLabel: "Facebookda kuzating",
    hoverColor: 'hover:text-blue-600 hover:border-blue-600/30',
  },
  { 
    name: 'Twitter', 
    href: SITE_CONFIG.social.twitter, 
    icon: Twitter,
    ariaLabel: "X.com (Twitter)da kuzating",
    hoverColor: 'hover:text-foreground hover:border-foreground/30',
  },
  { 
    name: 'LinkedIn', 
    href: SITE_CONFIG.social.linkedin, 
    icon: Linkedin,
    ariaLabel: "LinkedInda kuzating",
    hoverColor: 'hover:text-blue-700 hover:border-blue-700/30',
  },
  { 
    name: 'YouTube', 
    href: SITE_CONFIG.social.youtube, 
    icon: Youtube,
    ariaLabel: "YouTube kanalimiz",
    hoverColor: 'hover:text-red-500 hover:border-red-500/30',
  },
  { 
    name: 'GitHub', 
    href: SITE_CONFIG.social.github, 
    icon: Github,
    ariaLabel: "GitHub profilimiz",
    hoverColor: 'hover:text-foreground hover:border-foreground/30',
  },
];

export function SocialLinks({ className = '', showLabels = false }: SocialLinksProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.ariaLabel}
            className={`group flex items-center gap-2 text-muted-foreground transition-colors ${link.hoverColor}`}
          >
            <span className={`w-9 h-9 flex items-center justify-center rounded-full border border-foreground/10 group-hover:bg-foreground/5 transition-all`}>
              <Icon className="w-4 h-4" />
            </span>
            {showLabels && (
              <span className="text-sm font-medium">{link.name}</span>
            )}
          </a>
        );
      })}
    </div>
  );
}

/**
 * Compact version for mobile/sidebar
 */
export function SocialLinksCompact({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socialLinks.slice(0, 4).map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.ariaLabel}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/5 transition-all ${link.hoverColor}`}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
}
