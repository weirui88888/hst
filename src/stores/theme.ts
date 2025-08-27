import { defineStore } from 'pinia';

export type ThemeMode = 'light' | 'dark';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: (localStorage.getItem('theme') as ThemeMode | null) ?? 'dark',
  }),
  actions: {
    toggleTheme() {
      this.setTheme(this.mode === 'dark' ? 'light' : 'dark');
    },
    setTheme(mode: ThemeMode) {
      this.mode = mode;
      const root = document.documentElement.classList;
      if (mode === 'dark') root.add('dark');
      else root.remove('dark');
      localStorage.setItem('theme', mode);
    },
  },
});


