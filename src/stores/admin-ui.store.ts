import { create } from 'zustand';

type AdminUiState = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sourceFilter: string;
  setSourceFilter: (value: string) => void;
};

export const useAdminUiStore = create<AdminUiState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  sourceFilter: '',
  setSourceFilter: (value) => set({ sourceFilter: value }),
}));
