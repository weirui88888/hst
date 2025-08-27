<template>
  <div class="w-full md:h-full md:flex md:items-center md:justify-center overflow-hidden">
    <template v-if="validMedia.length">
      <component
        :is="mediaComponent(m)"
        v-for="(m, i) in validMedia"
        :key="i"
        :src="m.url"
        class="block max-w-full w-full h-auto object-cover"
        controls
        v-bind="extraProps(m)"
      ></component>
    </template>
    <template v-else>
      <div class="w-full h-full grid place-items-center text-neutral-400">无媒体</div>
    </template>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, computed } from 'vue';
  import type { MediaItem } from '../stores/timeline';

  export default defineComponent({
    name: 'MediaPreview',
    props: {
      media: {
        type: Array as PropType<MediaItem[] | undefined>,
        default: undefined,
      },
    },
    setup(props) {
      const validMedia = computed(() => (props.media ?? []).filter((m) => !!m.url));
      const mediaComponent = (m: MediaItem) => (m.type === 'video' ? 'video' : 'img');
      const extraProps = (m: MediaItem) =>
        m.type === 'video' ? { autoplay: true, muted: true, loop: true, playsinline: true } : {};
      return { validMedia, mediaComponent, extraProps };
    },
  });
</script>

<style scoped>
  /* 媒体在小屏强制不产生横向溢出 */
  :deep(img),
  :deep(video) {
    max-width: 100%;
    width: 100%;
    height: auto;
    display: block;
  }
  @media (max-width: 450px) {
    :deep(video),
    :deep(img) {
      object-fit: cover;
    }
  }
  /* 桌面端：当父容器（如 .timeline-image）设定了固定比例时，
     子元素填满容器避免上下出现背景（看起来像黑边） */
  @media (min-width: 768px) {
    :deep(video),
    :deep(img) {
      height: 100%;
      object-fit: cover;
    }
  }
</style>
