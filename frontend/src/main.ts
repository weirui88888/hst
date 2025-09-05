import { createApp } from "vue";
import { createPinia } from "pinia";
// import "./styles/global.css";
import "uno.css";
import "v-calendar/style.css";
import App from "./App.vue";
import { vIntersect } from "./directives/intersect";
import { vGsap } from "./directives/gsapScroll";
import { setupCalendar, DatePicker } from "v-calendar";
import {
  applySiteThemeCSSVariables,
  applyMetaThemeColor,
  detectCurrentTheme,
} from "./config/siteTheme";
import { initVConsole } from "./utils/vconsole";

// 全局滚动恢复机制 - 修复双重滚动条问题
const ensureScrollable = () => {
  if (typeof document !== "undefined") {
    // 确保html处理滚动，body不滚动
    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "hidden";
  }
};

// 在页面加载时确保可以滚动
ensureScrollable();

// 监听页面可见性变化，确保滚动状态正确
document.addEventListener("visibilitychange", ensureScrollable);

// 禁用浏览器的历史滚动恢复，并强制回到页面顶部（解决刷新后不在最顶端的问题）
if (typeof window !== "undefined") {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
}

const forceScrollToTop = () => {
  if (typeof window === "undefined") return;
  // 先设置 scrollTop，确保在部分移动端浏览器生效
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  // 再调用 window.scrollTo 兜底
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
};

// 在 window load 之后再进行一次，确保骨架屏渲染也不会影响最终位置
if (typeof window !== "undefined") {
  window.addEventListener(
    "load",
    () => {
      // 双 rAF 确保在首屏渲染与布局稳定后再置顶
      requestAnimationFrame(() => requestAnimationFrame(forceScrollToTop));
    },
    { passive: true },
  );
}

// 初始化移动端调试工具
initVConsole();

const app = createApp(App);
app.use(createPinia());
app.use(setupCalendar, {});
app.component("DatePicker", DatePicker);

app.directive("intersect", vIntersect);

app.directive("gsap", vGsap);

// 初始化主题（从localStorage读取）
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark" || !savedTheme) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

app.mount("#app");

// 应用挂载后再置顶一次，避免因首屏组件高度变化导致的偏移
forceScrollToTop();

// 设置站点主色 CSS 变量（可扩展为从设置中读取）
applySiteThemeCSSVariables();
// 设置浏览器地址栏主题色，跟随当前主题
applyMetaThemeColor(detectCurrentTheme());
