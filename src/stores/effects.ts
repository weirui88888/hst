import { defineStore } from 'pinia';

export const useEffectsStore = defineStore('effects', {
  state: () => ({
    animationsEnabled: true,
  }),
  actions: {
    toggleAnimations() {
      this.animationsEnabled = !this.animationsEnabled;
    },
    setAnimationsEnabled(enabled: boolean) {
      this.animationsEnabled = enabled;
    },
  },
});


