import { create } from 'zustand';

type MiniAppState = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  compactMode: boolean;
  setCompactMode: (value: boolean) => void;
  savedIds: string[];
  toggleSaved: (articleId: string) => void;
};

export const useMiniAppStore = create<MiniAppState>((set) => ({
  activeCategory: 'all',
  setActiveCategory: (category) => set({ activeCategory: category }),
  compactMode: false,
  setCompactMode: (value) => set({ compactMode: value }),
  savedIds: [],
  toggleSaved: (articleId) =>
    set((state) => ({
      savedIds: state.savedIds.includes(articleId)
        ? state.savedIds.filter((id) => id !== articleId)
        : [...state.savedIds, articleId],
    })),
}));
