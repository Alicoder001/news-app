'use client';

/**
 * Share Buttons Component with Lucide Icons
 * 
 * Social media share buttons with proper URLs for each platform.
 * Optimized for SEO and user engagement.
 * 
 * @author Antigravity Team
 */

import { useState } from 'react';
import { 
  Send, 
  Twitter, 
  Facebook, 
  Linkedin, 
  MessageCircle,
  Link2,
  Check,
  Share2,
  Mail,
} from 'lucide-react';
import { getShareUrls } from '@/lib/config/social';

interface ShareButtonsProps {
  url: string;
  title: string;
  summary?: string;
  compact?: boolean;
  className?: string;
}

export function ShareButtons({ url, title, summary, compact = false, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrls = getShareUrls(url, title, summary);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: summary, url });
      } catch {
        // User cancelled
      }
    }
  };

  const buttons = [
    { 
      name: 'Telegram', 
      href: shareUrls.telegram, 
      icon: Send,
      color: 'hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30',
    },
    { 
      name: 'Twitter', 
      href: shareUrls.twitter, 
      icon: Twitter, 
      color: 'hover:bg-neutral-500/10 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-500/30',
    },
    { 
      name: 'Facebook', 
      href: shareUrls.facebook, 
      icon: Facebook, 
      color: 'hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600/30',
    },
    { 
      name: 'LinkedIn', 
      href: shareUrls.linkedin, 
      icon: Linkedin, 
      color: 'hover:bg-blue-700/10 hover:text-blue-700 hover:border-blue-700/30',
    },
    { 
      name: 'WhatsApp', 
      href: shareUrls.whatsapp, 
      icon: MessageCircle, 
      color: 'hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30',
    },
    { 
      name: 'Email', 
      href: shareUrls.email, 
      icon: Mail, 
      color: 'hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/30',
    },
  ];

  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {buttons.slice(0, 4).map((btn) => {
          const Icon = btn.icon;
          return (
            <a
              key={btn.name}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              title={`${btn.name}da ulashish`}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground transition-colors ${btn.color}`}
            >
              <Icon className="w-4 h-4" />
            </a>
          );
        })}
        <button
          onClick={handleCopy}
          title={copied ? 'Nusxalandi!' : "Havolani nusxalash"}
          className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/10 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Ulashish
      </p>
      <div className="flex flex-wrap gap-2">
        {buttons.map((btn) => {
          const Icon = btn.icon;
          return (
            <a
              key={btn.name}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3 py-2 flex items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground border border-foreground/10 transition-colors ${btn.color}`}
            >
              <Icon className="w-4 h-4" />
              <span>{btn.name}</span>
            </a>
          );
        })}
        
        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          className="px-3 py-2 flex items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground border border-foreground/10 hover:bg-foreground/5 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
          <span>{copied ? 'Nusxalandi!' : 'Havola'}</span>
        </button>

        {/* Native Share (mobile) */}
        {'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="px-3 py-2 flex items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground border border-foreground/10 hover:bg-foreground/5 transition-colors md:hidden"
          >
            <Share2 className="w-4 h-4" />
            <span>Boshqalar</span>
          </button>
        )}
      </div>
    </div>
  );
}
