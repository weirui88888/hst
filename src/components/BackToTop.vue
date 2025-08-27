<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-90"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-90"
  >
    <button
      v-show="showBackToTop"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 w-8 h-8 rounded-full flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors border-none shadow-lg hover:shadow-xl z-50"
      title="返回顶部"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const showBackToTop = ref(false);

const checkScrollPosition = () => {
  showBackToTop.value = window.scrollY > 1000;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  window.addEventListener('scroll', checkScrollPosition, { passive: true });
  // 初始化检查
  checkScrollPosition();
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollPosition);
});
</script>

<style scoped>
/* 可以添加额外的自定义样式 */
</style>
