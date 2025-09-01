<template>
  <Teleport to="body">
    <Transition name="toast" appear>
      <div
        v-if="toasts.length > 0"
        class="fixed top-4 left-1/2 transform -translate-x-1/2 z-[2000] pointer-events-none"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto mb-2 px-3 py-2 rounded-lg shadow-lg bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-center text-sm whitespace-nowrap flex items-center gap-2"
        >
          <!-- 图标 -->
          <svg
            v-if="toast.type === 'info'"
            class="w-4 h-4 text-neutral-600 dark:text-neutral-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else-if="toast.type === 'success'"
            class="w-4 h-4 text-neutral-600 dark:text-neutral-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <svg
            v-else-if="toast.type === 'warn'"
            class="w-4 h-4 text-neutral-600 dark:text-neutral-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <svg
            v-else-if="toast.type === 'error'"
            class="w-4 h-4 text-neutral-600 dark:text-neutral-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>

          <!-- 消息文本 -->
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue';
  import { toasts, useToast } from '../utils/toast';

  // 将toast方法暴露到全局
  onMounted(() => {
    if (typeof window !== 'undefined') {
      (window as any).$toast = useToast();
    }
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      delete (window as any).$toast;
    }
  });
</script>

<style scoped>
  /* 进入动画 */
  .toast-enter-active {
    transition: all 0.3s ease-out;
  }

  .toast-enter-from {
    opacity: 0;
    transform: translate(-50%, -100%);
  }

  .toast-enter-to {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  /* 离开动画 */
  .toast-leave-active {
    transition: all 0.3s ease-in;
  }

  .toast-leave-from {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  .toast-leave-to {
    opacity: 0;
    transform: translate(-50%, -100%);
  }
</style>
