<template>
  <section class="relative w-full select-none" :style="rootStyle">
    <!-- 渐隐边缘遮罩，避免突兀 -->
    <div
      v-if="showMask"
      class="pointer-events-none absolute inset-y-0 left-0 mask-left"
      :style="{ width: `var(--mask-width)` }"
    ></div>
    <div
      v-if="showMask"
      class="pointer-events-none absolute inset-y-0 right-0 mask-right"
      :style="{ width: `var(--mask-width)` }"
    ></div>

    <div class="marquee-container">
      <!-- 第一行：从左往右 -->
      <div class="overflow-hidden">
        <div
          class="marquee-row"
          :style="getRowStyle('top', 'normal')"
          @mouseenter="pauseRow('top')"
          @mouseleave="resumeRow('top')"
        >
          <div v-for="(img, i) in topImages" :key="'top-' + i" class="marquee-item">
            <div class="image-wrapper">
              <img :src="img.url" :alt="`image-${i}`" loading="lazy" />
              <div class="image-overlay"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第二行：从右往左（相向滚动） -->
      <div class="overflow-hidden">
        <div
          class="marquee-row reverse"
          :style="getRowStyle('bottom', 'reverse')"
          @mouseenter="pauseRow('bottom')"
          @mouseleave="resumeRow('bottom')"
        >
          <div v-for="(img, i) in bottomImages" :key="'bottom-' + i" class="marquee-item">
            <div class="image-wrapper">
              <img :src="img.url" :alt="`image-${i}`" loading="lazy" />
              <div class="image-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  // @ts-nocheck
  import { computed, ref } from 'vue';
  import { useTimelineStore } from '../stores/timeline';

  interface MarqueeImage {
    url: string;
  }

  const props = defineProps<{
    images?: MarqueeImage[]; // 可直接传入图片列表（url）
    height?: number; // 行高，默认 160
    gap?: number; // 图片间距，默认 16
    speed?: number; // 滚动时长（秒），默认 60
    hoverPause?: boolean; // 悬停暂停，默认 true
    showMask?: boolean; // 是否显示两侧渐隐遮罩，默认 true
    maskWidth?: number; // 渐隐遮罩宽度（px），默认 64
    fullBleed?: boolean; // 是否全宽贴边（消除父级左右留白），默认 true
  }>();

  const store = useTimelineStore();

  const extractedImages = computed<MarqueeImage[]>(() => {
    if (props.images && props.images.length) return props.images;
    const items = (store.items || []) as any[];
    const result: MarqueeImage[] = [];
    for (const it of items) {
      const media = (it?.media || []) as any[];
      for (const m of media) {
        if (m?.type === 'image' && m?.url) {
          result.push({ url: m.url });
        }
      }
    }
    return result;
  });

  // 随机打乱图片数组
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 将图片分成上下两行，不重合且随机打乱
  const splitAndShuffleImages = computed(() => {
    const images = extractedImages.value;

    if (images.length === 0) {
      return { top: [], bottom: [] };
    }

    const shuffled = shuffleArray(images);
    const mid = Math.ceil(shuffled.length / 2);

    const result = {
      top: shuffled.slice(0, mid),
      bottom: shuffled.slice(mid),
    };


    return result;
  });

  const rootStyle = computed(() => {
    const speed = Math.max(30, props.speed || 60); // 增加默认速度到60秒，最小30秒
    const topOriginalCount = splitAndShuffleImages.value.top.length;
    const bottomOriginalCount = splitAndShuffleImages.value.bottom.length;

    // 计算正确的动画距离：移动一个完整周期的距离
    // 由于我们复制了4份图片，所以需要移动25%来显示完整的原始图片集
    // 这样可以确保在动画过程中能看到更多的图片
    const topMoveDistance = topOriginalCount > 0 ? 25 : 25; // 移动25%显示完整周期
    const bottomMoveDistance = bottomOriginalCount > 0 ? 25 : 25;

    return {
      // 使用 CSS 变量控制主题与尺寸
      '--row-height': `${Math.max(120, props.height || 160)}px`, // 增加默认高度到160px
      '--item-gap': `${Math.max(8, props.gap || 16)}px`, // 增加默认间距到16px
      '--marquee-duration': `${speed}s`,
      '--mask-width': `${Math.max(24, props.maskWidth || 64)}px`,
      '--move-distance': `${topMoveDistance}%`,
      // 全宽贴边：让组件突破父容器左右内边距/页面默认 margin
      // 修复横向滚动问题：使用更安全的全宽实现方式
      marginLeft: (props.fullBleed ?? true) ? 'calc(-1 * (100vw - 100%) / 2)' : undefined,
      marginRight: (props.fullBleed ?? true) ? 'calc(-1 * (100vw - 100%) / 2)' : undefined,
      // 确保容器不会超出视口宽度
      maxWidth: '100vw',
    } as any;
  });

  const rowStyle = (dir: 'normal' | 'reverse') =>
    ({
      animationPlayState: (props.hoverPause ?? true) ? 'running' : 'running',
    }) as any;

  const showMask = computed(() => props.showMask ?? true);

  // 暂停/恢复轮播的状态管理
  const pausedRows = ref(new Set<string>());

  const pauseRow = (row: string) => {
    if (props.hoverPause !== false) {
      pausedRows.value.add(row);
    }
  };

  const resumeRow = (row: string) => {
    if (props.hoverPause !== false) {
      pausedRows.value.delete(row);
    }
  };

  // 获取行样式，支持暂停功能
  const getRowStyle = (row: string, dir: 'normal' | 'reverse') =>
    ({
      animationPlayState: pausedRows.value.has(row) ? 'paused' : 'running',
    }) as any;

  // 创建圆环效果：复制足够多的图片，模拟无限传送带
  const topImages = computed(() => {
    const images = splitAndShuffleImages.value.top;
    if (images.length === 0) {
      return [];
    }
    // 复制4份形成圆环，确保视觉上的无限循环
    const cycles = 4; // 复制4个周期，确保有足够的图片进行无缝循环
    const result = [];
    for (let i = 0; i < cycles; i++) {
      result.push(...images);
    }

    return result;
  });

  const bottomImages = computed(() => {
    const images = splitAndShuffleImages.value.bottom;
    if (images.length === 0) {
      return [];
    }
    // 复制4份形成圆环，确保视觉上的无限循环
    const cycles = 4; // 复制4个周期，确保有足够的图片进行无缝循环
    const result = [];
    for (let i = 0; i < cycles; i++) {
      result.push(...images);
    }

    return result;
  });
</script>

<style scoped>
  .mask-left {
    background: linear-gradient(
      to right,
      var(--mask-color, rgba(0, 0, 0, 0.12)) 0%,
      transparent 100%
    );
  }
  .mask-right {
    background: linear-gradient(
      to left,
      var(--mask-color, rgba(0, 0, 0, 0.12)) 0%,
      transparent 100%
    );
  }

  .marquee-container {
    display: flex;
    flex-direction: column;
    gap: var(--item-gap);
  }

  :host,
  section {
    --mask-color: rgba(0, 0, 0, 0.08);
  }
  @media (prefers-color-scheme: dark) {
    :host,
    section {
      --mask-color: rgba(255, 255, 255, 0.14);
    }
  }

  .marquee-row {
    display: flex;
    align-items: center;
    gap: var(--item-gap);
    height: var(--row-height);
    /* 无缝滚动：使用 will-change 优化性能 */
    will-change: transform;
    animation: marquee var(--marquee-duration) linear infinite;
    /* 修复横向滚动问题：移除可能导致溢出的样式 */
    /* 确保图片能够正确显示，但不强制最小宽度 */
    width: fit-content;
  }

  .marquee-row.reverse {
    animation-direction: reverse;
  }

  .marquee-item {
    flex: 0 0 auto;
    height: var(--row-height);
    width: calc(var(--row-height) * 1.78); /* 16:9比例，1.78 = 16/9 */
    overflow: hidden;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .marquee-item img {
    height: 100%;
    width: 100%;
    display: block;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .marquee-item:hover .image-overlay {
    opacity: 0;
  }

  .marquee-item:hover img {
    transform: scale(1.05);
  }

  @keyframes marquee {
    from {
      transform: translateX(0%);
    }
    to {
      transform: translateX(calc(-1 * var(--move-distance)));
    }
  }

  /* 悬停暂停（可选） */
  .marquee-row:hover {
    animation-play-state: paused;
  }

  /* 降低用户眩晕感 */
  @media (prefers-reduced-motion: reduce) {
    .marquee-row {
      animation-duration: calc(var(--marquee-duration) * 2);
    }
  }
</style>
