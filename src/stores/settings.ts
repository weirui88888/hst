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

const getInitialSiteTitle = (): string => {
  try {
    const stored = localStorage.getItem('hst_site_title');
    return stored !== null ? stored : '我的故事';
  } catch {
    return '我的故事';
  }
};

const getInitialSiteEndText = (): string => {
  try {
    const stored = localStorage.getItem('hst_site_end_text');
    return stored !== null ? stored : '— 已到时间轴结尾 —';
  } catch {
    return '— 已到时间轴结尾 —';
  }
};

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    timeAxisPosition: getInitialTimeAxisPosition(),
    seasonalIndicator: getInitialSeasonalIndicator(),
    siteTitle: getInitialSiteTitle(),
    siteEndText: getInitialSiteEndText(),
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
    setSiteTitle(title: string) {
      // 允许空字符串，以便用户清空标题后再输入
      this.siteTitle = title;
      this.saveSiteTitle();
    },
    setSiteEndText(text: string) {
      this.siteEndText = text;
      this.saveSiteEndText();
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
    saveSiteTitle() {
      try {
        localStorage.setItem('hst_site_title', this.siteTitle);
      } catch (error) {
        console.warn('Failed to save site title to localStorage:', error);
      }
    },
    saveSiteEndText() {
      try {
        localStorage.setItem('hst_site_end_text', this.siteEndText);
      } catch (error) {
        console.warn('Failed to save site end text to localStorage:', error);
      }
    },
  },
});
