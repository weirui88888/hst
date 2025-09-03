import { defineStore } from "pinia";
import { UI_TEXTS } from "../config/texts";
import { userConfigAPI, type UserConfig } from "../utils/api";

// 主人模式 localStorage 键
const HST_APP_IS_MASTER = "hst_app_is_master";

// 从localStorage读取初始值
const getInitialTimeAxisPosition = (): string => {
  try {
    const stored = localStorage.getItem("hst_time_axis_position");
    return stored !== null ? stored : "right";
  } catch {
    return "right"; // 默认值
  }
};

const getInitialSeasonalIndicator = (): boolean => {
  try {
    const stored = localStorage.getItem("hst_seasonal_indicator");
    return stored !== null ? JSON.parse(stored) : false;
  } catch {
    return false; // 默认值
  }
};

const getInitialSiteTitle = (): string => {
  try {
    const stored = localStorage.getItem("hst_site_title");
    return stored && stored.trim() !== "" ? stored : UI_TEXTS.nav.defaultTitle;
  } catch {
    return UI_TEXTS.nav.defaultTitle;
  }
};

const getInitialSiteEndText = (): string => {
  try {
    const stored = localStorage.getItem("hst_site_end_text");
    return stored && stored.trim() !== ""
      ? stored
      : UI_TEXTS.settings.endText.default;
  } catch {
    return UI_TEXTS.settings.endText.default;
  }
};

const getInitialEpilogueMainTitle = (): string => {
  try {
    const stored = localStorage.getItem("hst_epilogue_main_title");
    return stored && stored.trim() !== ""
      ? stored
      : UI_TEXTS.settings.epilogueMessage.mainDefault;
  } catch {
    return UI_TEXTS.settings.epilogueMessage.mainDefault;
  }
};

const getInitialEpilogueSubTitle = (): string => {
  try {
    const stored = localStorage.getItem("hst_epilogue_sub_title");
    return stored && stored.trim() !== ""
      ? stored
      : UI_TEXTS.settings.epilogueMessage.subDefault;
  } catch {
    return UI_TEXTS.settings.epilogueMessage.subDefault;
  }
};

const getInitialMusicAutoPlay = (): boolean => {
  try {
    const stored = localStorage.getItem("hst_music_auto_play");
    return stored !== null ? JSON.parse(stored) : true;
  } catch {
    return true; // 默认开启
  }
};

const getInitialMasterMode = (): boolean => {
  try {
    const saved = localStorage.getItem(HST_APP_IS_MASTER);
    return saved === "1";
  } catch {
    return false;
  }
};

const getInitialSiteMusic = (): string => {
  try {
    const stored = localStorage.getItem("hst_site_music");
    return stored ?? "you-are-the-reason";
  } catch {
    return "you-are-the-reason";
  }
};

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    timeAxisPosition: getInitialTimeAxisPosition() as "left" | "right",
    seasonalIndicator: getInitialSeasonalIndicator(),
    siteTitle: getInitialSiteTitle(),
    siteEndText: getInitialSiteEndText(),
    epilogueMainTitle: getInitialEpilogueMainTitle(),
    epilogueSubTitle: getInitialEpilogueSubTitle(),
    musicAutoPlay: getInitialMusicAutoPlay(),
    animationsEnabled: true,
    loading: false,
    error: null as string | null,
    // 新增：跟踪是否有未保存的更改
    hasUnsavedChanges: false,
    // 主人模式（控制额外按钮与编辑权限）
    isMasterMode: getInitialMasterMode(),
    // 背景音乐选择
    siteMusic: getInitialSiteMusic(),
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
        this.epilogueMainTitle = config.epilogueMainTitle;
        this.epilogueSubTitle = config.epilogueSubTitle;
        this.timeAxisPosition = config.timeAxisPosition;
        this.seasonalIndicator = config.seasonalIndicator;
        this.animationsEnabled = config.animationsEnabled;
        this.siteMusic = (config as any).siteMusic || "you-are-the-reason";

        // 同步到本地存储
        this.saveToLocalStorage();
        this.hasUnsavedChanges = false;
      } catch (error) {
        console.error("加载用户配置失败:", error);
        this.error = error instanceof Error ? error.message : "加载配置失败";

        // 如果API失败，使用本地存储的数据
      } finally {
        this.loading = false;
      }
    },

    // 更新用户配置（延迟更新）
    async updateUserConfig() {
      if (!this.hasUnsavedChanges) {
        return; // 没有更改，不需要更新
      }

      // 保存当前状态，以便在失败时回滚
      const originalState = {
        siteTitle: this.siteTitle,
        siteEndText: this.siteEndText,
        epilogueMainTitle: this.epilogueMainTitle,
        epilogueSubTitle: this.epilogueSubTitle,
        timeAxisPosition: this.timeAxisPosition,
        seasonalIndicator: this.seasonalIndicator,
        animationsEnabled: this.animationsEnabled,
        siteMusic: (this as any).siteMusic,
      };

      try {
        const response = await userConfigAPI.updateConfig({
          siteTitle: this.siteTitle,
          siteEndText: this.siteEndText,
          epilogueMainTitle: this.epilogueMainTitle,
          epilogueSubTitle: this.epilogueSubTitle,
          timeAxisPosition: this.timeAxisPosition,
          seasonalIndicator: this.seasonalIndicator,
          animationsEnabled: this.animationsEnabled,
          siteMusic: (this as any).siteMusic,
        });

        // 同步到本地存储
        this.saveToLocalStorage();
        this.hasUnsavedChanges = false;

        return response.config;
      } catch (error) {
        console.error("更新用户配置失败:", error);

        // 回滚到原始状态
        this.siteTitle = originalState.siteTitle;
        this.siteEndText = originalState.siteEndText;
        this.epilogueMainTitle = originalState.epilogueMainTitle;
        this.epilogueSubTitle = originalState.epilogueSubTitle;
        this.timeAxisPosition = originalState.timeAxisPosition;
        this.seasonalIndicator = originalState.seasonalIndicator;
        this.animationsEnabled = originalState.animationsEnabled;
        (this as any).siteMusic = (originalState as any).siteMusic as any;

        // 重新保存到本地存储
        this.saveToLocalStorage();

        throw error;
      }
    },

    // 标记有未保存的更改
    markAsChanged() {
      this.hasUnsavedChanges = true;
    },

    setTimeAxisPosition(position: "left" | "right") {
      this.timeAxisPosition = position;
      this.saveTimeAxisPosition();
      this.markAsChanged();
    },

    setSeasonalIndicator(enabled: boolean) {
      this.seasonalIndicator = enabled;
      this.saveSeasonalIndicator();
      this.markAsChanged();
    },

    setSiteTitle(title: string) {
      // 允许空字符串，以便用户清空标题后再输入
      this.siteTitle = title;
      this.saveSiteTitle();
      this.markAsChanged();
    },

    setSiteEndText(text: string) {
      this.siteEndText = text;
      this.saveSiteEndText();
      this.markAsChanged();
    },

    setEpilogueMainTitle(title: string) {
      this.epilogueMainTitle = title;
      this.saveEpilogueMainTitle();
      this.markAsChanged();
    },

    setEpilogueSubTitle(subtitle: string) {
      this.epilogueSubTitle = subtitle;
      this.saveEpilogueSubTitle();
      this.markAsChanged();
    },

    setMusicAutoPlay(enabled: boolean) {
      this.musicAutoPlay = enabled;
      this.saveMusicAutoPlay();
      // 音乐自动播放设置只保存在本地，不标记为需要API更新
    },

    setAnimationsEnabled(enabled: boolean) {
      this.animationsEnabled = enabled;
      this.markAsChanged();
    },

    setSiteMusic(music: string) {
      this.siteMusic = music;
      try {
        localStorage.setItem("hst_site_music", music);
      } catch {}
      this.markAsChanged();
    },

    // 设置主人模式（同页内响应式，跨标签页依赖 storage 事件）
    setMasterMode(enabled: boolean) {
      this.isMasterMode = enabled;
      try {
        if (enabled) {
          localStorage.setItem(HST_APP_IS_MASTER, "1");
        } else {
          localStorage.removeItem(HST_APP_IS_MASTER);
        }
      } catch (error) {
        console.warn("Failed to persist master mode to localStorage:", error);
      }
    },

    // 保存到本地存储
    saveToLocalStorage() {
      this.saveTimeAxisPosition();
      this.saveSeasonalIndicator();
      this.saveSiteTitle();
      this.saveSiteEndText();
      this.saveEpilogueMainTitle();
      this.saveEpilogueSubTitle();
      this.saveMusicAutoPlay();
      this.saveSiteMusicKey();
    },

    saveTimeAxisPosition() {
      try {
        localStorage.setItem("hst_time_axis_position", this.timeAxisPosition);
      } catch (error) {
        console.warn(
          "Failed to save time axis position to localStorage:",
          error,
        );
      }
    },

    saveSeasonalIndicator() {
      try {
        localStorage.setItem(
          "hst_seasonal_indicator",
          JSON.stringify(this.seasonalIndicator),
        );
      } catch (error) {
        console.warn(
          "Failed to save seasonal indicator to localStorage:",
          error,
        );
      }
    },

    saveSiteTitle() {
      try {
        if (this.siteTitle && this.siteTitle.trim() !== "") {
          localStorage.setItem("hst_site_title", this.siteTitle);
        } else {
          localStorage.removeItem("hst_site_title");
        }
      } catch (error) {
        console.warn("Failed to save site title to localStorage:", error);
      }
    },

    saveSiteEndText() {
      try {
        if (this.siteEndText && this.siteEndText.trim() !== "") {
          localStorage.setItem("hst_site_end_text", this.siteEndText);
        } else {
          localStorage.removeItem("hst_site_end_text");
        }
      } catch (error) {
        console.warn("Failed to save site end text to localStorage:", error);
      }
    },

    saveEpilogueMainTitle() {
      try {
        if (this.epilogueMainTitle && this.epilogueMainTitle.trim() !== "") {
          localStorage.setItem(
            "hst_epilogue_main_title",
            this.epilogueMainTitle,
          );
        } else {
          localStorage.removeItem("hst_epilogue_main_title");
        }
      } catch (error) {
        console.warn(
          "Failed to save epilogue main title to localStorage:",
          error,
        );
      }
    },

    saveEpilogueSubTitle() {
      try {
        if (this.epilogueSubTitle && this.epilogueSubTitle.trim() !== "") {
          localStorage.setItem("hst_epilogue_sub_title", this.epilogueSubTitle);
        } else {
          localStorage.removeItem("hst_epilogue_sub_title");
        }
      } catch (error) {
        console.warn(
          "Failed to save epilogue sub title to localStorage:",
          error,
        );
      }
    },

    saveMusicAutoPlay() {
      try {
        localStorage.setItem(
          "hst_music_auto_play",
          JSON.stringify(this.musicAutoPlay),
        );
      } catch (error) {
        console.warn("Failed to save music auto play to localStorage:", error);
      }
    },

    saveSiteMusicKey() {
      try {
        localStorage.setItem("hst_site_music", this.siteMusic);
      } catch (error) {
        console.warn("Failed to save site music to localStorage:", error);
      }
    },

    // 清除错误状态
    clearError() {
      this.error = null;
    },
  },
});
