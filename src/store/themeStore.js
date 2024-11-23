import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set) => ({
      currentTheme: 'light',
      toggleTheme: () =>
        set((state) => ({
          currentTheme: state.currentTheme === 'light' ? 'dark' : 'light',
        })),
      setTheme: (theme) => set({ currentTheme: theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
)

export default useThemeStore
