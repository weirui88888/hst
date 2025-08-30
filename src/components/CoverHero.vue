<template>
  <section class="py-10 md:py-14">
    <div v-if="latest" class="grid md:grid-cols-2 gap-6 items-center">
      <div class="rounded-xl overflow-hidden aspect-video bg-neutral-200/60 dark:bg-neutral-800/60">
        <MediaPreview :media="latest.media" />
      </div>
      <div>
        <h2 class="text-2xl md:text-3xl font-semibold mb-2 text-neutral-800 dark:text-neutral-200">
          {{ latest.title }}
        </h2>
        <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">{{ latest.content }}</p>
        <div class="mt-3 text-sm flex flex-wrap gap-2">
          <span
            class="px-3 py-1 rounded-md bg-neutral-700 text-neutral-300 text-xs font-medium"
            v-for="tag in latest.tags"
            :key="tag"
            >#{{ tag }}</span
          >
          <span class="ml-auto text-neutral-500 dark:text-neutral-400 font-medium">{{
            latest.date
          }}</span>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-neutral-500">{{ UI_TEXTS.empty.noContent }}</div>
  </section>
</template>

<script setup lang="ts">
  // @ts-nocheck
  import { computed } from 'vue';
  import type { TimelineItem } from '../stores/timeline';
  import MediaPreview from './MediaPreview.vue';
  import { UI_TEXTS } from '../config/texts';

  const { latest: latestProp } = defineProps<{ latest?: TimelineItem | null }>();
  const latest = computed(() => latestProp ?? null);
</script>

<style scoped></style>
