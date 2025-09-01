<template>
  <div class="error-message">
    <div class="error-content">
      <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="error-text">数据加载失败，请检查网络连接</p>
      <button class="retry-button" @click="$emit('retry')">
        重试
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.retry-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #2563eb;
}

/* 暗黑主题适配 */
.dark .error-text {
  color: #9ca3af;
}

.dark .error-icon {
  color: #f87171;
}
</style>
