import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'uno.css';
import App from './App.vue';
import { vIntersect } from './directives/intersect';
import { vGsap } from './directives/gsapScroll';

const app = createApp(App);
app.use(createPinia());
app.directive('intersect', vIntersect);
app.directive('gsap', vGsap);

// 初始化主题（从localStorage读取）
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || !savedTheme) document.documentElement.classList.add('dark');

app.mount('#app');


