"use client";

import { Share2, Bookmark } from "lucide-react";
import { useState } from "react";

interface ArticleActionsProps {
  title: string;
  slug: string;
}

export function ArticleActions({ title, slug }: ArticleActionsProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/tg/article/${slug}`;
    
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url,
      }).catch(console.error);
    } else {
      // Fallback or Telegram specific (if using Telegram WebApp SDK)
      // For now just copy to clipboard or alert
      navigator.clipboard.writeText(url);
      alert("Havola nusxalandi!");
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    // Request to backend to toggle save would go here
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
        className={`p-1.5 rounded-full hover:bg-foreground/5 transition-colors ${isSaved ? 'text-blue-500 fill-current' : 'text-muted-foreground hover:text-foreground'}`}
        aria-label="Saqlash"
      >
        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
}
