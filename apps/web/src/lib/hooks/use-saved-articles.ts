"use client";

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'aishunos_saved_articles';

export interface SavedArticle {
  slug: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  categoryName?: string;
  categoryColor?: string;
  readingTime?: number;
  savedAt: string;
}

function loadInitialSavedArticles(): SavedArticle[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as SavedArticle[]) : [];
  } catch (error) {
    console.error('Failed to load saved articles:', error);
    return [];
  }
}

/**
 * Hook for managing saved articles in localStorage
 * Used in Telegram Mini App for offline-first bookmarks
 */
export function useSavedArticles() {
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>(loadInitialSavedArticles);
  const isLoaded = true;

  // Save article
  const saveArticle = useCallback((article: Omit<SavedArticle, 'savedAt'>) => {
    setSavedArticles(prev => {
      // Don't add duplicates
      if (prev.some(a => a.slug === article.slug)) {
        return prev;
      }
      const updated = [{ ...article, savedAt: new Date().toISOString() }, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Remove article
  const removeArticle = useCallback((slug: string) => {
    setSavedArticles(prev => {
      const updated = prev.filter(a => a.slug !== slug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Toggle save state
  const toggleSave = useCallback((article: Omit<SavedArticle, 'savedAt'>) => {
    setSavedArticles(prev => {
      const exists = prev.some(a => a.slug === article.slug);
      let updated: SavedArticle[];
      
      if (exists) {
        updated = prev.filter(a => a.slug !== article.slug);
      } else {
        updated = [{ ...article, savedAt: new Date().toISOString() }, ...prev];
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Check if article is saved
  const isArticleSaved = useCallback((slug: string) => {
    return savedArticles.some(a => a.slug === slug);
  }, [savedArticles]);

  // Clear all saved articles
  const clearAll = useCallback(() => {
    setSavedArticles([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    savedArticles,
    saveArticle,
    removeArticle,
    toggleSave,
    isArticleSaved,
    clearAll,
    isLoaded,
    count: savedArticles.length,
  };
}
