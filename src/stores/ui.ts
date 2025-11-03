import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;
  isCreateBookDialogOpen: boolean;
  isCreateEntryDialogOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setCreateBookDialogOpen: (isOpen: boolean) => void;
  setCreateEntryDialogOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      isSidebarOpen: true,
      isCreateBookDialogOpen: false,
      isCreateEntryDialogOpen: false,
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          if (typeof document !== 'undefined') {
            if (newTheme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          return { theme: newTheme };
        }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setCreateBookDialogOpen: (isOpen) => set({ isCreateBookDialogOpen: isOpen }),
      setCreateEntryDialogOpen: (isOpen) => set({ isCreateEntryDialogOpen: isOpen }),
    }),
    {
      name: 'memento-ui-storage',
    }
  )
);
