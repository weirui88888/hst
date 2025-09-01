declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // 使用 object 代替 {} 以避免 ESLint no-empty-object-type 报错
  const component: DefineComponent<object, object, any>;
  export default component;
}
