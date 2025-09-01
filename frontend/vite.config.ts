import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';

export default defineConfig({
  plugins: [vue(), UnoCSS()],
  server: {
    host: true, // 监听 0.0.0.0，允许局域网设备访问
    port: 5173, // 可按需修改
    strictPort: false,
  },
});
