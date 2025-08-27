<template>
  <div class="w-full h-full flex items-center justify-center overflow-hidden">
    <template v-if="validMedia.length">
      <component :is="mediaComponent(m)" v-for="(m, i) in validMedia" :key="i" :src="m.url" class="w-full h-full object-cover" controls v-bind="extraProps(m)"></component>
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
    const validMedia = computed(() => (props.media ?? []).filter(m => !!m.url));
    const mediaComponent = (m: MediaItem) => (m.type === 'video' ? 'video' : 'img');
    const extraProps = (m: MediaItem) => (m.type === 'video' ? { autoplay: true, muted: true, loop: true, playsinline: true } : {});
    return { validMedia, mediaComponent, extraProps };
  },
});
</script>

<style scoped>
</style>


