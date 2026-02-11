'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';

interface AdContent {
  title: string;
  description: string;
  cta: string;
  imageUrl: string;
  color: string;
}

const MOCK_ADS: Record<string, AdContent> = {
  hosting: {
    title: 'CloudScale DevOps',
    description: 'Ultra-fast hosting for Next.js apps.',
    cta: 'Start Free',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800',
    color: '#3b82f6'
  },
  ai: {
    title: 'NeuralMind AI',
    description: 'Build GPT-powered agents in minutes.',
    cta: 'Try API',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800',
    color: '#8b5cf6'
  },
  course: {
    title: 'React Masters',
    description: 'Advanced patterns for senior devs.',
    cta: 'Enroll Now',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800',
    color: '#ec4899'
  }
};

interface AdBannerProps {
  slot: string;
  format: 'leaderboard' | 'rectangle' | 'in-feed' | 'mobile-banner';
  className?: string;
  type?: keyof typeof MOCK_ADS;
}

export function AdBanner({ slot, format, className = '', type }: AdBannerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Simplified ad selection logic
  const adKeys = Object.keys(MOCK_ADS) as Array<keyof typeof MOCK_ADS>;
  const selectedType = type || (slot.includes('sidebar') ? 'rectangle' : adKeys[Math.floor(Math.random() * adKeys.length)]);
  const ad = MOCK_ADS[selectedType] || MOCK_ADS.hosting;

  const dimensions = {
    leaderboard: 'h-[90px] w-full max-w-[728px]',
    rectangle: 'h-[250px] w-full max-w-[300px]',
    'in-feed': 'h-[120px] w-full',
    'mobile-banner': 'h-[50px] w-full max-w-[320px]',
  };

  if (!isMounted) return <div className={`${dimensions[format]} ${className} bg-foreground/[0.02]`} />;

  return (
    <div 
      className={`relative flex items-center justify-center overflow-hidden border border-white/10 
                 bg-background rounded-sm transition-all duration-500 hover:border-white/20
                 group ${dimensions[format]} ${className}`}
      aria-label="Advertisement"
    >
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image 
          src={ad.imageUrl} 
          alt="" 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover opacity-20 grayscale brightness-50 group-hover:opacity-30 group-hover:grayscale-0 transition-all duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40 z-10" />
      </div>
      
      {/* Content */}
      <div className="relative z-20 w-full h-full flex items-center p-4 gap-4">
        {format === 'rectangle' ? (
           <div className="flex flex-col items-center justify-center text-center space-y-3 w-full">
              <div className="w-12 h-12 relative rounded-sm overflow-hidden mb-2">
                 <Image 
                   src={ad.imageUrl} 
                   alt="" 
                   fill 
                   sizes="48px"
                   className="object-cover" 
                 />
              </div>
              <div className="space-y-1">
                 <h4 className="text-sm font-bold tracking-tight">{ad.title}</h4>
                 <p className="text-[11px] text-muted-foreground leading-tight px-4">{ad.description}</p>
              </div>
              <button className="px-4 py-1.5 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest rounded-sm hover:scale-105 transition-transform">
                 {ad.cta}
              </button>
           </div>
        ) : (
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex items-center gap-4">
               <div className="w-16 h-full relative rounded-sm overflow-hidden hidden sm:block">
                  <Image 
                    src={ad.imageUrl} 
                    alt="" 
                    fill 
                    sizes="64px"
                    className="object-cover" 
                  />
               </div>
               <div className="space-y-0.5">
                 <div className="text-[8px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-0.5">Sponsored</div>
                 <h4 className="text-sm font-bold tracking-tight">{ad.title}</h4>
                 <p className="text-[12px] text-muted-foreground leading-none hidden md:block">{ad.description}</p>
               </div>
            </div>
            <button className="px-4 py-2 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest rounded-sm hover:scale-105 transition-transform shrink-0">
               {ad.cta}
            </button>
          </div>
        )}
      </div>

      {/* Subtle Ad Badge */}
      <div className="absolute top-1 right-1 text-[7px] uppercase tracking-tighter text-white/20 z-30">Ad</div>
    </div>
  );
}
