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
      class="fixed w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors border-none shadow-lg hover:shadow-xl z-[999]"
      :style="positionStyle"
      title="返回顶部"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue';

  const showBackToTop = ref(false);
  const viewportWidth = ref(0);
  const viewportHeight = ref(0);
  const threshold = ref(1000);

  const checkScrollPosition = () => {
    showBackToTop.value = window.scrollY > threshold.value;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const updateViewport = () => {
    viewportWidth.value = window.innerWidth;
    viewportHeight.value = window.innerHeight;
    // 自适应显示阈值：移动端更早显示
    threshold.value = viewportWidth.value <= 450 ? 300 : viewportHeight.value < 800 ? 600 : 1000;
  };

  const positionStyle = computed(() => {
    const isNarrow = viewportWidth.value <= 450;
    return {
      bottom: isNarrow ? 'calc(1.5rem + env(safe-area-inset-bottom))' : '2rem',
      right: isNarrow ? '1rem' : '2rem',
    } as Record<string, string>;
  });

  onMounted(() => {
    updateViewport();
    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    window.addEventListener('resize', updateViewport, { passive: true } as any);
    // 初始化检查
    checkScrollPosition();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', checkScrollPosition);
    window.removeEventListener('resize', updateViewport as any);
  });
</script>

<style scoped>
  /* 可以添加额外的自定义样式 */
</style>
