<template>
  <div>
    <NavBar />
    <main class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <ErrorMessage v-if="hasError" @retry="retryLoading" />
      <template v-else>
        <CoverHero :latest="latestItem" />
        <Timeline
          :items="items"
          :seasonalIndicator="settings.seasonalIndicator"
          :animationsEnabled="effects.animationsEnabled"
          :timeAxisPosition="settings.timeAxisPosition"
        />
      </template>
    </main>
    <!-- 全宽横向滚动组件（直接使用组件内置的全宽贴边功能） -->
    <ImageMarquee :height="180" :gap="6" :speed="100" :hoverPause="true" :fullBleed="true" />

    <!-- 故事延续文字区域 -->
    <section
      class="py-16 text-center story-section"
      :class="{ visible: isVisible }"
      ref="storySection"
    >
      <div class="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <h2
          class="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-4 typewriter-text"
        >
          {{ UI_TEXTS.storyContinuation.title }}
        </h2>
        <p class="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed fade-in-text">
          {{ UI_TEXTS.storyContinuation.subtitle }}
        </p>
      </div>
    </section>

    <BackToTop />
    <Toast />
    <MusicPlayer />
  </div>
</template>

<script setup lang="ts">
  // @ts-nocheck
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import NavBar from './components/NavBar.vue';
  import CoverHero from './components/CoverHero.vue';
  import Timeline from './components/Timeline.vue';
  import BackToTop from './components/BackToTop.vue';
  import Toast from './components/Toast.vue';
  import ImageMarquee from './components/ImageMarquee.vue';
  import MusicPlayer from './components/MusicPlayer.vue';
  import ErrorMessage from './components/ErrorMessage.vue';
  import { useTimelineStore } from './stores/timeline';
  import { useEffectsStore } from './stores/effects';
  import { useSettingsStore } from './stores/settings';
  import { UI_TEXTS } from './config/texts';

  const timelineStore = useTimelineStore();
  const effects = useEffectsStore();
  const settings = useSettingsStore();
  
  // 使用computed响应式获取数据
  const items = computed(() => timelineStore.timelineItems);
  const latestItem = computed(() => items.value?.[0] ?? null);
  
  // 计算是否有错误
  const hasError = computed(() => 
    timelineStore.error || settings.error
  );
  
  // 重试加载数据
  const retryLoading = async () => {
    timelineStore.clearError();
    settings.clearError();
    try {
      await Promise.all([
        timelineStore.loadTimelineData(),
        settings.loadUserConfig()
      ]);
    } catch (error) {
      console.error('重试加载数据失败:', error);
    }
  };

  // 滚动触发动画相关
  const storySection = ref<HTMLElement>();
  const isVisible = ref(false);
  let observer: IntersectionObserver | null = null;

  onMounted(async () => {
    // 加载数据
    try {
      await Promise.all([
        timelineStore.loadTimelineData(),
        settings.loadUserConfig()
      ]);
    } catch (error) {
      console.error('加载数据失败:', error);
    }

    if (storySection.value) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isVisible.value = true;
              // 一旦触发就停止观察，避免重复触发
              observer?.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.3, // 当30%的元素可见时触发
          rootMargin: '0px 0px -50px 0px', // 提前50px触发
        },
      );

      observer.observe(storySection.value);
    }

    // 添加调试功能
    if (typeof window !== 'undefined') {
      (window as any).debugScroll = () => {};

      // 添加修复滚动条的函数
      (window as any).fixScroll = () => {
        document.documentElement.style.overflowX = 'hidden';
        document.documentElement.style.overflowY = 'auto';
        document.body.style.overflowX = 'hidden';
        document.body.style.overflowY = 'hidden';
      };
    }
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });
</script>

<style>
  /* .vc-container .vc-weekday-1, .vc-container .vc-weekday-7  {
  color: red;
}

.vc-container .is-today{
  background-color: red;
} */

  /* .vc-container.vc-dark,.vc-container.vc-dark .vc-arrow{
  @apply bg-neutral-900;
 }
 .vc-container.vc-dark .vc-title{
  @apply bg-neutral-900;
 }
 .vc-nav-popover-container.vc-dark button{
  background: none;
  @apply text-white ;
 }
 .vc-nav-popover-container.vc-dark button:hover{
  @apply bg-[#334155] ;
 }

 .vc-nav-popover-container.vc-dark button:hover{
  @apply bg-[#334155] ;
 }
 .vc-nav-popover-container.vc-dark button.is-active{
  background-color: var(--site-main-color);
 } */

  /* 故事延续文字动画样式 */
  .story-section {
    opacity: 0;
    transform: translateY(30px);
    transition:
      opacity 1s ease-out,
      transform 1s ease-out;
  }

  .story-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .typewriter-text {
    opacity: 0;
    transform: scale(2);
    transition:
      opacity 1.5s ease-out 1s,
      transform 1.5s ease-out 1s;
  }

  .story-section.visible .typewriter-text {
    opacity: 1;
    transform: scale(1);
  }

  .fade-in-text {
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 1s ease-out 0.5s,
      transform 1s ease-out 0.5s;
  }

  .story-section.visible .fade-in-text {
    opacity: 1;
    transform: translateY(0);
  }

  /* 暗黑主题适配 */
  .dark .typewriter-text {
    color: #f8fafc;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .typewriter-text {
      font-size: 1.875rem;
    }
  }

  /* 减少动画偏好设置 */
  @media (prefers-reduced-motion: reduce) {
    .story-section,
    .typewriter-text,
    .fade-in-text {
      transition: none;
      opacity: 1;
      transform: none;
      max-width: 100%;
    }

    .typewriter-text::after {
      display: none;
    }
  }
</style>
