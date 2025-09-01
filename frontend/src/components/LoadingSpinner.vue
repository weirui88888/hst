<template>
  <div class="loading-spinner">
    <div class="spinner"></div>
    <p class="loading-text">加载中...</p>
  </div>
</template>

<script setup lang="ts">
// 简单的加载组件，不需要props
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

/* 暗黑主题适配 */
.dark .spinner {
  border-color: #374151;
  border-top-color: #60a5fa;
}

.dark .loading-text {
  color: #9ca3af;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 减少动画偏好设置 */
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
}
</style>
