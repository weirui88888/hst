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

// 设置站点主色 CSS 变量（可扩展为从设置中读取）
applySiteThemeCSSVariables();
// 设置浏览器地址栏主题色，跟随当前主题
applyMetaThemeColor(detectCurrentTheme());
