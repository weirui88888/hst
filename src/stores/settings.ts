import { defineStore } from 'pinia';
import { UI_TEXTS } from '../config/texts';

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
    return stored !== null ? stored : UI_TEXTS.nav.defaultTitle;
  } catch {
    return UI_TEXTS.nav.defaultTitle;
  }
};

const getInitialSiteEndText = (): string => {
  try {
    const stored = localStorage.getItem('hst_site_end_text');
    return stored !== null ? stored : UI_TEXTS.settings.endText.default;
  } catch {
    return UI_TEXTS.settings.endText.default;
  }
};

const getInitialMusicAutoPlay = (): boolean => {
  try {
    const stored = localStorage.getItem('hst_music_auto_play');
    return stored !== null ? JSON.parse(stored) : true;
  } catch {
    return true; // 默认开启
  }
};

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    timeAxisPosition: getInitialTimeAxisPosition(),
    seasonalIndicator: getInitialSeasonalIndicator(),
    siteTitle: getInitialSiteTitle(),
    siteEndText: getInitialSiteEndText(),
    musicAutoPlay: getInitialMusicAutoPlay(),
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
    setMusicAutoPlay(enabled: boolean) {
      this.musicAutoPlay = enabled;
      this.saveMusicAutoPlay();
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
    saveMusicAutoPlay() {
      try {
        localStorage.setItem('hst_music_auto_play', JSON.stringify(this.musicAutoPlay));
      } catch (error) {
        console.warn('Failed to save music auto play to localStorage:', error);
      }
    },
  },
});
