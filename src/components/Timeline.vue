<template>
  <section class="relative py-8">
    <!-- 时间轴线 -->
    <div
      class="fixed top-1/2 -translate-y-1/2 z-50 hidden md:block transition-all duration-300"
      :class="timeAxisPosition === 'left' ? 'left-8' : 'right-8'"
    >
      <div class="relative timeline-axis">
        <!-- 时间轴竖线 -->
        <div
          class="w-0.5 h-64 timeline-axis-line mx-auto cursor-pointer"
          @click="handleTimelineClick"
        ></div>

        <!-- 当前时间点 -->
        <div
          class="absolute left-1/2 w-3 h-3 bg-neutral-600 dark:bg-neutral-400 rounded-full border-2 border-neutral-900 dark:border-neutral-100 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 timeline-axis-point cursor-pointer hover:scale-110 hover:bg-neutral-500 dark:hover:bg-neutral-300"
          :class="{ 'duration-0': isDragging || isAutoScrolling }"
          :style="timeAxisPositionStyle"
          @mousedown="startDrag"
          @touchstart="startDrag"
        ></div>

        <!-- 当前时间显示 -->
        <div
          class="absolute top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 text-sm font-medium whitespace-nowrap transition-all duration-200 timeline-time"
          :class="[
            timeAxisPosition === 'left' ? 'left-6 text-right' : 'right-6 text-left',
            isDragging || isAutoScrolling ? 'duration-0' : '',
          ]"
          :style="[timeAxisPositionStyle, timeAxisLabelStyle]"
        >
          {{ currentTimeDisplay }}
        </div>
      </div>
    </div>

    <div class="space-y-16">
      <article
        v-for="(item, index) in items"
        :key="`${item.id}-${animationsEnabled}`"
        :ref="(el) => setSectionRef(el, index)"
        class="relative will-change-transform"
        :class="[animationsEnabled ? 'transition-all duration-500' : '', articleClass(index)]"
      >
        <!-- 故事内容 -->
        <div
          class="relative max-w-4xl mx-auto"
          :class="[
            animationsEnabled ? 'transition-all duration-700 ease-out' : '',
            storyClass(index),
          ]"
        >
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start"
            :class="layoutClass(index)"
          >
            <!-- 图片区域 -->
            <div
              class="relative"
              :class="imageOrderClass(index)"
              v-gsap="imageAnimationProps(index)"
            >
              <div class="w-full rounded-2xl overflow-hidden md:overflow-visible p-0 md:p-8">
                <div
                  :style="imageFrameStyle(item)"
                  class="timeline-image w-full rounded-xl overflow-hidden"
                  :class="[
                    animationsEnabled
                      ? 'transition-all duration-300 md:hover:scale-[1.02] animations-enabled'
                      : '',
                  ]"
                >
                  <MediaPreview :media="item.media" />
                </div>
              </div>
            </div>

            <!-- 文字区域 -->
            <div
              class="space-y-3 md:space-y-4 px-4 md:px-0"
              :class="textOrderClass(index)"
              v-gsap="textAnimationProps(index)"
            >
              <div>
                <h3
                  class="text-xl md:text-2xl font-semibold mb-2 tracking-tight text-neutral-800 dark:text-neutral-200"
                >
                  {{ item.title }}
                </h3>
                <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {{ item.content }}
                </p>
              </div>

              <div class="flex flex-wrap gap-2 items-center">
                <span
                  class="px-3 py-1 rounded-md bg-neutral-700 text-neutral-300 text-xs font-medium"
                  v-for="tag in item.tags"
                  :key="tag"
                  >#{{ tag }}</span
                >
                <span class="ml-auto text-sm text-neutral-500 dark:text-neutral-400 font-medium">{{
                  item.date
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
      <!-- 时间轴结尾标记 -->
      <div class="mt-20 flex flex-col items-center select-none">
        <div class="h-px w-24 bg-neutral-300/50 dark:bg-neutral-700/60"></div>
        <div class="mt-3 text-sm tracking-wide text-neutral-400 dark:text-neutral-500">
          {{
            $settings && $settings.siteEndText
              ? $settings.siteEndText
              : settingsStore.siteEndText || '— 已到时间轴结尾 —'
          }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  // @ts-nocheck
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  type CSSProperties = Partial<CSSStyleDeclaration>;
  import MediaPreview from './MediaPreview.vue';
  import { useSettingsStore } from '../stores/settings';

  const props = defineProps<{
    items?: any[];
    seasonalIndicator?: boolean;
    animationsEnabled?: boolean;
    timeAxisPosition?: string;
  }>();

  const activeIndex = ref<number>(-1);
  const sectionRefs = ref<HTMLElement[]>([]);
  const rafId = ref<number>(0);
  const isDragging = ref<boolean>(false);
  const dragStartY = ref<number>(0);
  const timelineAxisTop = ref<number>(0);
  const timelineAxisHeight = ref<number>(0);
  const isAutoScrolling = ref<boolean>(false);
  const autoScrollTimer = ref<any>(0);
  const axisEndPaddingRatio = ref<number>(0.1);
  const axisPaddingPx = ref<number>(16);

  const settingsStore = useSettingsStore();

  const timeAxisPositionStyle = computed(() => {
    if (activeIndex.value === -1 || props.items.length === 0) {
      return { top: '50%' } as CSSProperties;
    }

    const baseProgress = activeIndex.value / (props.items.length - 1);
    const ratioPad = Math.max(0, Math.min(0.49, axisEndPaddingRatio.value));
    const mappedProgress = ratioPad + baseProgress * (1 - 2 * ratioPad);

    const { minY, range } = getAxisMetrics();
    const topPosition = minY + mappedProgress * range;
    return { top: `${topPosition}px` } as CSSProperties;
  });

  const timeAxisLabelStyle = computed(() => {
    return {
      width: '120px',
      display: 'inline-block',
      fontVariantNumeric: 'tabular-nums',
    } as CSSProperties;
  });

  const currentTimeDisplay = computed(() => {
    if (activeIndex.value === -1 || props.items.length === 0) {
      return '';
    }
    const currentItem = (props.items ?? [])[activeIndex.value];
    const date = currentItem?.date || '';
    if ((props.seasonalIndicator ?? false) && date) {
      const month = getMonthFromDate(date);
      const season = getSeasonFromMonth(month);
      return `${season} ${date}`;
    }
    return date;
  });

  const setSectionRef = (el: any, idx: number) => {
    if (el) sectionRefs.value[idx] = el as HTMLElement;
  };

  const startDrag = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    isDragging.value = true;

    const timelineAxis = document.querySelector('.timeline-axis') as HTMLElement;
    if (timelineAxis) {
      const rect = timelineAxis.getBoundingClientRect();
      timelineAxisTop.value = rect.top;
      timelineAxisHeight.value = rect.height;
    }

    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    dragStartY.value = clientY;

    document.addEventListener('mousemove', onDrag as any);
    document.addEventListener('touchmove', onDrag as any, { passive: false } as any);
    document.addEventListener('mouseup', stopDrag as any);
    document.addEventListener('touchend', stopDrag as any);

    document.body.style.userSelect = 'none';
  };

  const onDrag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return;
    event.preventDefault();
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const relativeY = clientY - timelineAxisTop.value;
    const { minY, maxY, range } = getAxisMetrics();
    const relativeDragY = Math.max(minY, Math.min(maxY, relativeY));
    const rawProgress = range > 0 ? (relativeDragY - minY) / range : 0;
    const ratioPad = Math.max(0, Math.min(0.49, axisEndPaddingRatio.value));
    const baseProgress = Math.max(0, Math.min(1, (rawProgress - ratioPad) / (1 - 2 * ratioPad)));
    const newIndex = Math.round(baseProgress * (props.items.length - 1));
    if (newIndex !== activeIndex.value && newIndex >= 0 && newIndex < props.items.length) {
      activeIndex.value = newIndex;
    }
  };

  const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', onDrag as any);
    document.removeEventListener('touchmove', onDrag as any);
    document.removeEventListener('mouseup', stopDrag as any);
    document.removeEventListener('touchend', stopDrag as any);
    if (activeIndex.value >= 0) {
      scrollToStory(activeIndex.value);
    }
    document.body.style.userSelect = '';
  };

  const scrollToStory = (index: number) => {
    const targetElement = sectionRefs.value[index];
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const targetCenter = rect.top + rect.height / 2;
      const scrollOffset = targetCenter - viewportCenter;
      isAutoScrolling.value = true;
      if (autoScrollTimer.value) window.clearTimeout(autoScrollTimer.value);
      autoScrollTimer.value = window.setTimeout(() => {
        isAutoScrolling.value = false;
      }, 120);
      window.scrollBy({ top: scrollOffset, behavior: 'auto' });
    }
  };

  const handleTimelineClick = (event: MouseEvent) => {
    if (isDragging.value) return;
    const timelineAxis = document.querySelector('.timeline-axis') as HTMLElement;
    if (!timelineAxis) return;
    const rect = timelineAxis.getBoundingClientRect();
    const clickY = event.clientY - rect.top;
    const { minY, maxY, range } = getAxisMetrics();
    const relativeClickY = Math.max(minY, Math.min(maxY, clickY));
    const rawProgress = range > 0 ? (relativeClickY - minY) / range : 0;
    const ratioPad = Math.max(0, Math.min(0.49, axisEndPaddingRatio.value));
    const baseProgress = Math.max(0, Math.min(1, (rawProgress - ratioPad) / (1 - 2 * ratioPad)));
    const newIndex = Math.round(baseProgress * (props.items.length - 1));
    if (newIndex >= 0 && newIndex < props.items.length) {
      activeIndex.value = newIndex;
      scrollToStory(newIndex);
    }
  };

  const getAxisMetrics = () => {
    const axisEl = document.querySelector('.timeline-axis') as HTMLElement | null;
    const lineEl = document.querySelector('.timeline-axis-line') as HTMLElement | null;
    if (!axisEl || !lineEl) {
      const fallbackHeight = 256;
      const pxPad = Math.max(0, Math.min(fallbackHeight / 2 - 1, axisPaddingPx.value));
      const ratioPad = Math.max(0, Math.min(0.49, axisEndPaddingRatio.value));
      const ratioPadPx = fallbackHeight * ratioPad;
      const padPx = Math.max(pxPad, ratioPadPx);
      const minY = padPx;
      const maxY = fallbackHeight - padPx;
      const range = Math.max(0, maxY - minY);
      return { minY, maxY, range };
    }
    const axisRect = axisEl.getBoundingClientRect();
    const lineRect = lineEl.getBoundingClientRect();
    const lineTop = lineRect.top - axisRect.top;
    const lineBottom = lineRect.bottom - axisRect.top;
    const lineHeight = Math.max(0, lineBottom - lineTop);
    const pxPad = Math.max(0, Math.min(lineHeight / 2 - 1, axisPaddingPx.value));
    const ratioPad = Math.max(0, Math.min(0.49, axisEndPaddingRatio.value));
    const ratioPadPx = lineHeight * ratioPad;
    const padPx = Math.max(pxPad, ratioPadPx);
    const minY = lineTop + padPx;
    const maxY = lineBottom - padPx;
    const range = Math.max(0, maxY - minY);
    timelineAxisTop.value = axisRect.top;
    timelineAxisHeight.value = axisRect.height;
    return { minY, maxY, range };
  };

  const updateActive = () => {
    if (isDragging.value || isAutoScrolling.value) return;
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const viewportH = window.innerHeight;
    const scrollHeight = Math.max(
      doc.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
      doc.offsetHeight,
      doc.clientHeight,
    );
    const bottomGap = scrollHeight - (scrollTop + viewportH);
    const edgeThreshold = 24;
    if (scrollTop <= edgeThreshold && activeIndex.value !== 0) {
      activeIndex.value = 0;
      return;
    }
    if (bottomGap <= edgeThreshold && activeIndex.value !== props.items.length - 1) {
      activeIndex.value = props.items.length - 1;
      return;
    }
    const viewportCenter = window.innerHeight / 2;
    let best = -1;
    let bestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < sectionRefs.value.length; i += 1) {
      const el = sectionRefs.value[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const dist = Math.abs(center - viewportCenter);
      if (rect.bottom > 0 && rect.top < window.innerHeight && dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    if (best !== -1 && best !== activeIndex.value) {
      activeIndex.value = best;
    }
  };

  const onScroll = () => {
    if (rafId.value) cancelAnimationFrame(rafId.value);
    rafId.value = requestAnimationFrame(() => {
      updateActive();
    });
  };

  const articleClass = (index: number) => {
    if (!(props.animationsEnabled ?? true)) {
      return 'opacity-100';
    }
    return index === activeIndex.value ? 'opacity-100' : 'opacity-60';
  };

  const storyClass = (index: number) => {
    if (!(props.animationsEnabled ?? true)) {
      return 'scale-100 translate-y-0';
    }
    if (index === activeIndex.value) {
      return 'scale-[1.02] md:scale-[1.05] -translate-y-4 md:-translate-y-6';
    }
    return 'scale-100 translate-y-0';
  };

  const layoutClass = (index: number) => {
    const imagePositions = [
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
    ];
    const imageOnLeft = imagePositions[index % imagePositions.length];
    return imageOnLeft ? '' : 'md:grid-flow-col-dense';
  };

  const imageOrderClass = (index: number) => {
    const imagePositions = [
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
    ];
    const imageOnLeft = imagePositions[index % imagePositions.length];
    return imageOnLeft ? 'order-1 md:order-1' : 'order-1 md:order-2';
  };

  const textOrderClass = (index: number) => {
    const imagePositions = [
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
    ];
    const imageOnLeft = imagePositions[index % imagePositions.length];
    return imageOnLeft ? 'order-2 md:order-2' : 'order-2 md:order-1';
  };

  const imageAnimationProps = (index: number) => {
    const imagePositions = [
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
    ];
    const imageOnLeft = imagePositions[index % imagePositions.length];
    return {
      direction: imageOnLeft ? 'right' : 'left',
      skew: 4,
      rotate: 1,
      distance: 80,
      ease: 'power3.out',
      duration: 0.9,
    };
  };

  const textAnimationProps = (index: number) => {
    const imagePositions = [
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      false,
      true,
      false,
    ];
    const imageOnLeft = imagePositions[index % imagePositions.length];
    return {
      direction: imageOnLeft ? 'left' : 'right',
      distance: 60,
      ease: 'power2.out',
      scale: 0.98,
      stagger: 0.08,
    };
  };

  const imageFrameStyle = (item: any) => {
    const media = item.media?.[0];
    let aspectRatio: string | undefined = undefined;
    if (media?.aspectRatio) {
      const [width, height] = media.aspectRatio.split('/').map(Number);
      if (width && height) {
        aspectRatio = `${width}/${height}`;
      }
    }
    const isNarrow = typeof window !== 'undefined' && window.innerWidth <= 450;
    if (isNarrow) {
      const style: CSSProperties = {
        transform: 'none',
        boxShadow: 'none',
      };
      return style;
    }
    const rotation = getRandomRotation(item.id);
    const shadowOffset = getRandomShadowOffset(item.id);
    const style: CSSProperties = {
      transform: `rotate(${rotation}deg)`,
      boxShadow: `${shadowOffset.x}px ${shadowOffset.y}px 20px rgba(0, 0, 0, 0.3)`,
      transition: 'all 0.3s ease-out',
    };
    if (aspectRatio) (style as any).aspectRatio = aspectRatio;
    return style;
  };

  const getRandomRotation = (itemId: string) => {
    let hash = 0;
    for (let i = 0; i < itemId.length; i++) {
      const char = itemId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const randomValue = Math.abs(hash) % 100;
    if (randomValue < 65) {
      return ((hash % 21) - 10) / 10;
    } else if (randomValue < 90) {
      return ((hash % 61) - 30) / 10;
    } else if (randomValue < 98) {
      return ((hash % 101) - 50) / 10;
    } else {
      return ((hash % 161) - 80) / 10;
    }
  };

  const getRandomAspectRatio = (itemId: string) => {
    const seed = itemId + 'aspect';
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const randomValue = Math.abs(hash) % 100;
    if (randomValue < 35) {
      return '16/9';
    } else if (randomValue < 55) {
      return '4/3';
    } else if (randomValue < 70) {
      return '1/1';
    } else if (randomValue < 80) {
      return '3/2';
    } else if (randomValue < 88) {
      return '5/4';
    } else if (randomValue < 94) {
      return '3/4';
    } else if (randomValue < 98) {
      return '21/9';
    } else {
      return '2/3';
    }
  };

  const getRandomShadowOffset = (itemId: string) => {
    const seed = itemId + 'shadow';
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const randomValue = Math.abs(hash) % 100;
    let x, y;
    if (randomValue < 70) {
      x = ((hash % 81) - 40) / 10;
      y = (((hash * 31) % 81) - 40) / 10;
    } else if (randomValue < 90) {
      x = ((hash % 161) - 80) / 10;
      y = (((hash * 31) % 161) - 80) / 10;
    } else {
      x = ((hash % 241) - 120) / 10;
      y = (((hash * 31) % 241) - 120) / 10;
    }
    return { x, y };
  };

  const getMonthFromDate = (dateString: string) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.getMonth() + 1;
    }
    const monthMatch = dateString.match(/(\d{1,2})[-/](\d{1,2})/);
    if (monthMatch) {
      return parseInt(monthMatch[2]);
    }
    const isoMatch = dateString.match(/(\d{4})-(\d{1,2})/);
    if (isoMatch) {
      return parseInt(isoMatch[2]);
    }
    return 1;
  };

  const getSeasonFromMonth = (month: number) => {
    if (month >= 3 && month <= 5) {
      return '🌱春';
    } else if (month >= 6 && month <= 8) {
      return '🌞夏';
    } else if (month >= 9 && month <= 11) {
      return '🍂秋';
    } else {
      return '❄️冬';
    }
  };

  onMounted(() => {
    updateActive();
    window.addEventListener('scroll', onScroll as any, { passive: true } as any);
    window.addEventListener(
      'resize',
      () => {
        const axisEl = document.querySelector('.timeline-axis') as HTMLElement | null;
        if (axisEl) {
          const rect = axisEl.getBoundingClientRect();
          timelineAxisTop.value = rect.top;
          timelineAxisHeight.value = rect.height;
        }
        onScroll();
      },
      { passive: true } as any,
    );
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll as any);
    window.removeEventListener('resize', onScroll as any);
    if (rafId.value) cancelAnimationFrame(rafId.value);
    stopDrag();
  });
</script>

<style scoped>
  /* 图片倾斜效果增强 */
  .timeline-image {
    transform-origin: center center;
    backface-visibility: hidden;
  }

  /* 悬停时的动画效果 - 只在动画开启时生效 */
  .timeline-image.animations-enabled:hover {
    transform: scale(1.03) rotate(var(--rotation, 0deg)) !important;
    box-shadow: var(--shadow-x, 0px) var(--shadow-y, 0px) 15px rgba(0, 0, 0, 0.3) !important;
    z-index: 10;
  }

  /* 确保图片在倾斜时不会超出容器 */
  .overflow-visible {
    overflow: visible !important;
  }

  /* 添加一些微妙的背景装饰 - 只在动画开启时生效 */
  .timeline-image::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .timeline-image.animations-enabled:hover::before {
    opacity: 1;
  }

  /* 时间轴线样式 */
  .timeline-axis {
    border-radius: 20px;
    padding: 20px 10px;
  }

  /* 时间标签固定宽度并使用等宽数字，防抖动 */
  .timeline-time {
    width: 120px;
    font-variant-numeric: tabular-nums;
  }

  .timeline-axis-line {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(156, 163, 175, 0.3) 20%,
      rgba(156, 163, 175, 0.6) 50%,
      rgba(156, 163, 175, 0.3) 80%,
      transparent 100%
    );
  }

  .timeline-axis-point {
    box-shadow: 0 0 10px rgba(156, 163, 175, 0.4);
  }

  /* 窄屏：禁用倾斜与放大，强制隐藏横向溢出 */
  @media (max-width: 450px) {
    .timeline-image {
      transform: none !important;
      box-shadow: none !important;
    }
    .timeline-image.animations-enabled:hover {
      transform: none !important;
      box-shadow: none !important;
    }
  }
</style>
