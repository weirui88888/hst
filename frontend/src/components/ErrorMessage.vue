<template>
  <div class="error-message">
    <div class="error-content">
      <svg
        class="error-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="error-text">数据加载失败，请检查网络连接</p>
      <button class="retry-button" @click="$emit('retry')">重试</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SITE_MAIN_COLOR } from "../config/siteTheme";

// 创建 hexToRgba 函数用于悬停效果
function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized,
    16,
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 错误提示组件
</script>

<style scoped>
.error-message {
  display: flex;
  justify-content: center;
  padding: 2rem;
  min-height: 200px;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: v-bind(SITE_MAIN_COLOR);
  margin-bottom: 1rem;
}

.error-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.retry-button {
  background-color: v-bind(SITE_MAIN_COLOR);
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: v-bind(hexToRgba(SITE_MAIN_COLOR, 0.8));
}

/* 暗黑主题适配 */
.dark .error-text {
  color: #9ca3af;
}
</style>
