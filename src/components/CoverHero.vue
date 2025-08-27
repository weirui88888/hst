<template>
  <section class="py-10 md:py-14">
    <div v-if="latest" class="grid md:grid-cols-2 gap-6 items-center">
      <div class="rounded-xl overflow-hidden aspect-video bg-neutral-200/60 dark:bg-neutral-800/60">
        <MediaPreview :media="latest.media" />
      </div>
      <div>
        <h2 class="text-2xl md:text-3xl font-semibold mb-2">{{ latest.title }}</h2>
        <p class="opacity-90 leading-relaxed">{{ latest.content }}</p>
        <div class="mt-3 text-sm opacity-70 flex flex-wrap gap-2">
          <span class="px-2 py-0.5 rounded-full bg-white/70 dark:bg-neutral-800/70 border border-neutral-200/60 dark:border-neutral-700" v-for="tag in latest.tags" :key="tag">#{{ tag }}</span>
          <span class="ml-auto">{{ latest.date }}</span>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-neutral-500">还没有内容，点击右上角“录入”开始记录吧。</div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { TimelineItem } from '../stores/timeline';
import MediaPreview from './MediaPreview.vue';

export default defineComponent({
  name: 'CoverHero',
  components: { MediaPreview },
  props: {
    latest: {
      type: Object as PropType<TimelineItem | null>,
      default: null,
    },
  },
});
</script>

<style scoped>
</style>


