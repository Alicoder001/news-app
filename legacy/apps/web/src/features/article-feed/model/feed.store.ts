'use client';

import { create } from 'zustand';

interface ArticleFeedStore {
  pageSize: number;
  autoLoad: boolean;
  setPageSize: (value: number) => void;
  setAutoLoad: (value: boolean) => void;
}

export const useArticleFeedStore = create<ArticleFeedStore>((set) => ({
  pageSize: 12,
  autoLoad: true,
  setPageSize: (value) => set({ pageSize: value }),
  setAutoLoad: (value) => set({ autoLoad: value }),
}));
