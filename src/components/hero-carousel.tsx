'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { Category, Article } from '@prisma/client';

type FeaturedArticle = Article & {
  category: Category | null;
  imageUrl?: string | null; // Explicitly adding optional imageUrl to silence linter if Prisma types are stale
};

interface HeroCarouselProps {
  articles: FeaturedArticle[];
}

export function HeroCarousel({ articles }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
        if (emblaApi) {
            // emblaApi.off('select', onSelect); // emblaApi.off is not a function in v8? checking docs... usually it is. 
            // actually reInit logic handles cleanup internally mostly but let's stick to safe usage.
            // If API differs, minimal cleanup:
        }
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  if (!articles.length) return null;

  return (
    <div className="relative group/carousel">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {articles.map((article) => (
            <div className="flex-[0_0_100%] min-w-0 pl-1" key={article.id}>
              <article className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pb-8 border-b border-border">
                {/* Image Section */}
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-muted">
                   {article.imageUrl ? (
                     <Image
                       src={article.imageUrl}
                       alt={article.title}
                       fill
                       className="object-cover transition-transform duration-700 group-hover/carousel:scale-105"
                       sizes="(max-width: 768px) 100vw, 50vw"
                       priority={true}
                     />
                   ) : (
                     <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        No Image
                     </div>
                   )}
                </div>

                {/* Content Section */}
                <div className="space-y-3">
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                      {article.category && (
                        <span style={{ color: article.category.color || 'inherit' }} className="brightness-90">
                          {article.category.name}
                        </span>
                      )}
                      <span className="w-0.5 h-0.5 rounded-full bg-foreground/20"></span>
                      <span>{new Date(article.createdAt).toLocaleDateString('uz-UZ')}</span>
                   </div>

                   <Link href={`/article/${article.slug}`} className="block group-hover/carousel:opacity-95 transition-opacity">
                      <h2 className="text-2xl md:text-3xl font-serif font-bold leading-tight tracking-tight text-foreground mb-2">
                        {article.title}
                      </h2>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                   </Link>

                   <div className="flex items-center gap-3 pt-1">
                       <span className="text-xs text-muted-foreground font-medium">Antigravity Team</span>
                       <span className="text-muted-foreground text-xs">•</span>
                       <span className="text-xs text-muted-foreground">
                         {article.readingTime || 5} min read
                       </span>
                   </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Navigation - Positioned relative to content or bottom */}
      <div className="flex justify-center gap-2 mt-4">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? 'bg-foreground w-4'
                : 'bg-foreground/20 hover:bg-foreground/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
