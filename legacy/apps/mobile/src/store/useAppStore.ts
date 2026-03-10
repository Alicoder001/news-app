/**
 * Zustand App Store
 *
 * Global state management for theme, locale, and user preferences
 *
 * @package @news-app/mobile
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Locale } from '@news-app/i18n';

interface AppState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Saved articles
  savedArticles: string[]; // article IDs
  saveArticle: (id: string) => void;
  unsaveArticle: (id: string) => void;
  isArticleSaved: (id: string) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme defaults
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Locale defaults
      locale: 'uz',
      setLocale: (locale) => set({ locale }),

      // Saved articles
      savedArticles: [],
      saveArticle: (id) =>
        set((state) => ({
          savedArticles: [...state.savedArticles, id],
        })),
      unsaveArticle: (id) =>
        set((state) => ({
          savedArticles: state.savedArticles.filter((i) => i !== id),
        })),
      isArticleSaved: (id) => get().savedArticles.includes(id),
    }),
    {
      name: 'news-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
