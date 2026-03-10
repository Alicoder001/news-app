"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useSavedArticles, SavedArticle } from '@/lib/hooks/use-saved-articles';

interface SavedArticlesContextType {
  savedArticles: SavedArticle[];
  saveArticle: (article: Omit<SavedArticle, 'savedAt'>) => void;
  removeArticle: (slug: string) => void;
  toggleSave: (article: Omit<SavedArticle, 'savedAt'>) => void;
  isArticleSaved: (slug: string) => boolean;
  clearAll: () => void;
  isLoaded: boolean;
  count: number;
}

const SavedArticlesContext = createContext<SavedArticlesContextType | undefined>(undefined);

export function SavedArticlesProvider({ children }: { children: ReactNode }) {
  const savedArticlesState = useSavedArticles();

  return (
    <SavedArticlesContext.Provider value={savedArticlesState}>
      {children}
    </SavedArticlesContext.Provider>
  );
}

export function useSavedArticlesContext() {
  const context = useContext(SavedArticlesContext);
  if (context === undefined) {
    throw new Error('useSavedArticlesContext must be used within a SavedArticlesProvider');
  }
  return context;
}

// Re-export types
export type { SavedArticle };
