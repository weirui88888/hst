import { defineStore } from 'pinia';

// 从localStorage读取初始值
const getInitialAnimationsEnabled = (): boolean => {
  try {
    const stored = localStorage.getItem('hst_animations_enabled');
    return stored !== null ? JSON.parse(stored) : true;
  } catch {
    return true; // 默认值
  }
};

export const useEffectsStore = defineStore('effects', {
  state: () => ({
    animationsEnabled: getInitialAnimationsEnabled(),
  }),
  actions: {
    toggleAnimations() {
      this.animationsEnabled = !this.animationsEnabled;
      this.saveToLocalStorage();
    },
    setAnimationsEnabled(enabled: boolean) {
      this.animationsEnabled = enabled;
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      try {
        localStorage.setItem('hst_animations_enabled', JSON.stringify(this.animationsEnabled));
      } catch (error) {
        console.warn('Failed to save animations setting to localStorage:', error);
      }
    },
  },
});
