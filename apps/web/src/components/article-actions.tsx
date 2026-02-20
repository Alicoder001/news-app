"use client";

import { Share2, Bookmark } from "lucide-react";
import { useSavedArticlesContext, SavedArticle } from "./saved-articles-provider";
import { routing } from '@/i18n/routing';

interface ArticleActionsProps {
  title: string;
  slug: string;
  summary?: string;
  imageUrl?: string;
  categoryName?: string;
  categoryColor?: string;
  readingTime?: number;
}

export function ArticleActions({ 
  title, 
  slug,
  summary,
  imageUrl,
  categoryName,
  categoryColor,
  readingTime,
}: ArticleActionsProps) {
  const { toggleSave, isArticleSaved, isLoaded } = useSavedArticlesContext();
  const isSaved = isLoaded && isArticleSaved(slug);

  const resolveLocalePrefix = (pathname: string): string => {
    const [firstSegment] = pathname.split('/').filter(Boolean);
    if (
      firstSegment &&
      routing.locales.includes(firstSegment as (typeof routing.locales)[number])
    ) {
      return `/${firstSegment}`;
    }

    return '';
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const localePrefix = resolveLocalePrefix(window.location.pathname);
    const url = `${window.location.origin}${localePrefix}/tg/article/${slug}`;
    
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert("Havola nusxalandi!");
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const articleData: Omit<SavedArticle, 'savedAt'> = {
      slug,
      title,
      summary,
      imageUrl,
      categoryName,
      categoryColor,
      readingTime,
    };
    
    toggleSave(articleData);
  };

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={handleShare}
        className="p-1.5 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Ulashish"
      >
        <Share2 className="w-4 h-4" />
      </button>
      <button 
        onClick={handleSave}
        className={`p-1.5 rounded-full hover:bg-foreground/5 transition-colors ${isSaved ? 'text-blue-500' : 'text-muted-foreground hover:text-foreground'}`}
        aria-label={isSaved ? "Saqlangandan o'chirish" : "Saqlash"}
      >
        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
}
