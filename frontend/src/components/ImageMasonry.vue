<template>
  <section class="w-full" :style="rootStyle">
    <div class="masonry" :style="masonryStyle">
      <div v-for="(img, i) in imagesList" :key="i" class="item" :style="itemStyle">
        <img :src="img.url" :alt="`masonry-${i}`" loading="lazy" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  // @ts-nocheck
  import { computed } from 'vue';
  import { useTimelineStore } from '../stores/timeline';

  interface Pic {
    url: string;
  }

  const props = defineProps<{
    images?: Pic[];
    minColumnWidth?: number; // 每列最小宽度，默认 320，越大图片越大
    gap?: number; // 列/行间距，默认 14
    borderRadius?: number; // 图片圆角，默认 14
  }>();

  const store = useTimelineStore();

  const extracted = computed<Pic[]>(() => {
    if (props.images?.length) return props.images;
    const result: Pic[] = [];
    for (const it of (store.items || []) as any[]) {
      for (const m of (it?.media || []) as any[]) {
        if (m?.type === 'image' && m?.url) result.push({ url: m.url });
      }
    }
    return result;
  });

  const imagesList = computed(() => extracted.value);

  const rootStyle = computed(
    () =>
      ({
        '--masonry-gap': `${props.gap ?? 14}px`,
        '--masonry-radius': `${props.borderRadius ?? 14}px`,
      }) as any,
  );

  const masonryStyle = computed(
    () =>
      ({
        columnGap: `var(--masonry-gap)`,
        columnWidth: `${props.minColumnWidth ?? 320}px`,
      }) as any,
  );

  const itemStyle = computed(
    () =>
      ({
        breakInside: 'avoid',
        marginBottom: 'var(--masonry-gap)',
      }) as any,
  );
</script>

<style scoped>
  .masonry {
    column-gap: var(--masonry-gap);
  }
  .item {
    break-inside: avoid;
    -webkit-column-break-inside: avoid;
    margin-bottom: var(--masonry-gap);
    border-radius: var(--masonry-radius);
    overflow: hidden;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
  }
  .item img {
    width: 100%;
    height: auto;
    display: block;
  }

  /* 深色模式微调阴影 */
  @media (prefers-color-scheme: dark) {
    .item {
      box-shadow: 0 8px 18px rgba(255, 255, 255, 0.08);
    }
  }

  /* 小屏更大图片（减少列数） */
  @media (max-width: 640px) {
    .masonry {
      column-width: 260px !important;
    }
  }
  @media (min-width: 1024px) {
    .masonry {
      column-width: inherit;
    }
  }
</style>
