import { defineStore } from 'pinia';

// 从localStorage读取初始值
const getInitialTimeAxisPosition = (): string => {
  try {
    const stored = localStorage.getItem('hst_time_axis_position');
    return stored !== null ? stored : 'right';
  } catch {
    return 'right'; // 默认值
  }
};

const getInitialSeasonalIndicator = (): boolean => {
  try {
    const stored = localStorage.getItem('hst_seasonal_indicator');
    return stored !== null ? JSON.parse(stored) : false;
  } catch {
    return false; // 默认值
  }
};

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    timeAxisPosition: getInitialTimeAxisPosition(),
    seasonalIndicator: getInitialSeasonalIndicator(),
  }),
  actions: {
    setTimeAxisPosition(position: string) {
      this.timeAxisPosition = position;
      this.saveTimeAxisPosition();
    },
    setSeasonalIndicator(enabled: boolean) {
      this.seasonalIndicator = enabled;
      this.saveSeasonalIndicator();
    },
    saveTimeAxisPosition() {
      try {
        localStorage.setItem('hst_time_axis_position', this.timeAxisPosition);
      } catch (error) {
        console.warn('Failed to save time axis position to localStorage:', error);
      }
    },
    saveSeasonalIndicator() {
      try {
        localStorage.setItem('hst_seasonal_indicator', JSON.stringify(this.seasonalIndicator));
      } catch (error) {
        console.warn('Failed to save seasonal indicator to localStorage:', error);
      }
    },
  },
});
