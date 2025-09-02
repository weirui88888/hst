<template>
  <section class="py-10 md:py-14">
    <div v-if="latest" class="grid md:grid-cols-2 gap-6 items-center">
      <div
        class="rounded-xl overflow-hidden aspect-video bg-neutral-200/60 dark:bg-neutral-800/60"
      >
        <MediaPreview :media="latest.media" />
      </div>
      <div>
        <h2
          class="text-2xl md:text-3xl font-semibold mb-2 text-neutral-800 dark:text-neutral-200"
        >
          {{ latest.title }}
        </h2>
        <div
          class="text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap"
        >
          {{ latest.content }}
        </div>
        <div class="mt-3 text-sm flex flex-wrap gap-2">
          <span
            class="px-3 py-1 rounded-md bg-neutral-700 text-neutral-300 text-xs font-medium"
            v-for="tag in latest.tags"
            :key="tag"
            >#{{ tag }}</span
          >
          <span
            class="ml-auto text-neutral-500 dark:text-neutral-400 font-medium"
            >{{ formatDate(latest.date) }}</span
          >
        </div>
      </div>
    </div>
    <div v-else class="text-center text-neutral-500">
      {{ UI_TEXTS.empty.noContent }}
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed } from "vue";
import type { TimelineItem } from "../stores/timeline";
import MediaPreview from "./MediaPreview.vue";
import { UI_TEXTS } from "../config/texts";

const { latest: latestProp } = defineProps<{ latest?: TimelineItem | null }>();
const latest = computed(() => latestProp ?? null);

// 格式化日期，只显示年月日
const formatDate = (dateValue: Date | string) => {
  if (!dateValue) return "";

  let date: Date;
  if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === "string") {
    // 如果已经是YYYY-MM-DD格式，直接返回
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    // 尝试解析日期字符串
    date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return dateValue; // 如果无法解析，返回原字符串
    }
  } else {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
</script>

<style scoped></style>
