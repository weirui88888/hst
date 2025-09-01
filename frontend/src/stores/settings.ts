import { defineStore } from 'pinia';
import { UI_TEXTS } from '../config/texts';
import { userConfigAPI, type UserConfig } from '../utils/api';

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
    timeAxisPosition: getInitialTimeAxisPosition() as 'left' | 'right',
    seasonalIndicator: getInitialSeasonalIndicator(),
    siteTitle: getInitialSiteTitle(),
    siteEndText: getInitialSiteEndText(),
    musicAutoPlay: getInitialMusicAutoPlay(),
    animationsEnabled: true,
    loading: false,
    error: null as string | null,
  }),
  
  actions: {
    // 加载用户配置
    async loadUserConfig() {
      this.loading = true;
      this.error = null;
      
      try {
        const config = await userConfigAPI.getConfig();
        
        // 更新状态
        this.siteTitle = config.siteTitle;
        this.siteEndText = config.siteEndText;
        this.timeAxisPosition = config.timeAxisPosition;
        this.seasonalIndicator = config.seasonalIndicator;
        this.animationsEnabled = config.animationsEnabled;
        
        // 同步到本地存储
        this.saveToLocalStorage();
      } catch (error) {
        console.error('加载用户配置失败:', error);
        this.error = error instanceof Error ? error.message : '加载配置失败';
        
        // 如果API失败，使用本地存储的数据
      } finally {
        this.loading = false;
      }
    },
    
    // 更新用户配置
    async updateUserConfig() {
      try {
        const response = await userConfigAPI.updateConfig({
          siteTitle: this.siteTitle,
          siteEndText: this.siteEndText,
          timeAxisPosition: this.timeAxisPosition,
          seasonalIndicator: this.seasonalIndicator,
          animationsEnabled: this.animationsEnabled,
        });
        
        // 同步到本地存储
        this.saveToLocalStorage();
        
        return response.config;
      } catch (error) {
        console.error('更新用户配置失败:', error);
        throw error;
      }
    },
    
    setTimeAxisPosition(position: 'left' | 'right') {
      this.timeAxisPosition = position;
      this.saveTimeAxisPosition();
      this.updateUserConfig().catch(console.error);
    },
    
    setSeasonalIndicator(enabled: boolean) {
      this.seasonalIndicator = enabled;
      this.saveSeasonalIndicator();
      this.updateUserConfig().catch(console.error);
    },
    
    setSiteTitle(title: string) {
      // 允许空字符串，以便用户清空标题后再输入
      this.siteTitle = title;
      this.saveSiteTitle();
      this.updateUserConfig().catch(console.error);
    },
    
    setSiteEndText(text: string) {
      this.siteEndText = text;
      this.saveSiteEndText();
      this.updateUserConfig().catch(console.error);
    },
    
    setMusicAutoPlay(enabled: boolean) {
      this.musicAutoPlay = enabled;
      this.saveMusicAutoPlay();
      // 音乐自动播放设置只保存在本地
    },
    
    setAnimationsEnabled(enabled: boolean) {
      this.animationsEnabled = enabled;
      this.updateUserConfig().catch(console.error);
    },
    
    // 保存到本地存储
    saveToLocalStorage() {
      this.saveTimeAxisPosition();
      this.saveSeasonalIndicator();
      this.saveSiteTitle();
      this.saveSiteEndText();
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
    
    // 清除错误状态
    clearError() {
      this.error = null;
    },
  },
});
