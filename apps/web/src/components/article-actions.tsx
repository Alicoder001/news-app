"use client";

import { Share2, Bookmark } from "lucide-react";
import { useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { useSavedArticlesContext, SavedArticle } from "./saved-articles-provider";

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
  const locale = useLocale();
  const { toggleSave, isArticleSaved, isLoaded } = useSavedArticlesContext();
  const isSaved = isLoaded && isArticleSaved(slug);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const localePrefix = locale === routing.defaultLocale ? '' : `/${locale}`;
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
