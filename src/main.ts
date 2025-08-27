import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'uno.css';
import 'v-calendar/style.css';
import App from './App.vue';
import { vIntersect } from './directives/intersect';
import { vGsap } from './directives/gsapScroll';
import { setupCalendar, DatePicker } from 'v-calendar';
import { applySiteThemeCSSVariables } from './config/siteTheme';

const app = createApp(App);
app.use(createPinia());
app.use(setupCalendar, {});
app.component('DatePicker', DatePicker);

app.directive('intersect', vIntersect);

app.directive('gsap', vGsap);

// 初始化主题（从localStorage读取）
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || !savedTheme) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

app.mount('#app');

// 设置站点主色 CSS 变量（可扩展为从设置中读取）
applySiteThemeCSSVariables();
