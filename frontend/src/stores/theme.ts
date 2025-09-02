import { defineStore } from "pinia";
import { applyMetaThemeColor } from "../config/siteTheme";

export type ThemeMode = "light" | "dark";

export const useThemeStore = defineStore("theme", {
  state: () => {
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    const defaultTheme = savedTheme || "dark";

    // 确保HTML根元素有正确的类
    const root = document.documentElement.classList;
    if (defaultTheme === "dark") {
      root.add("dark");
    } else {
      root.remove("dark");
    }

    return {
      mode: defaultTheme,
    };
  },
  actions: {
    toggleTheme() {
      this.setTheme(this.mode === "dark" ? "light" : "dark");
    },
    setTheme(mode: ThemeMode) {
      this.mode = mode;
      const root = document.documentElement.classList;
      if (mode === "dark") {
        root.add("dark");
      } else {
        root.remove("dark");
      }
      localStorage.setItem("theme", mode);
      // 同步更新浏览器地址栏/系统 UI 的颜色
      applyMetaThemeColor(mode);
    },
  },
});
