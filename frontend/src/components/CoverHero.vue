<template>
  <section class="py-10 md:py-14">
    <!-- 骨架屏：加载中优先渲染，避免空态闪烁 -->
    <div v-if="loading" class="grid md:grid-cols-2 gap-6 select-none">
      <div class="rounded-xl overflow-hidden skeleton-box h-48 md:h-64"></div>
      <div class="space-y-3">
        <div class="h-6 w-3/4 rounded skeleton-box"></div>
        <div class="h-4 w-full rounded skeleton-box"></div>
        <div class="h-4 w-5/6 rounded skeleton-box"></div>
        <div class="flex gap-2 mt-4 items-center">
          <div class="h-6 w-14 rounded-md skeleton-box"></div>
          <div class="h-6 w-14 rounded-md skeleton-box"></div>
          <div class="h-6 w-14 rounded-md skeleton-box"></div>
          <div class="ml-auto h-4 w-24 rounded skeleton-box"></div>
        </div>
      </div>
    </div>

    <div v-else-if="latest" class="grid md:grid-cols-2 gap-6">
      <div
        class="rounded-xl overflow-hidden bg-neutral-200/60 dark:bg-neutral-800/60"
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

const { latest: latestProp, loading = false } = defineProps<{
  latest?: TimelineItem | null;
  loading?: boolean;
}>();
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

<style scoped>
/* Skeleton base with better dark contrast and shimmer */
.skeleton-box {
  position: relative;
  overflow: hidden;
  background-color: rgba(229, 231, 235, 0.9); /* neutral-200 - 浅色模式 */
}

.dark .skeleton-box {
  background-color: rgba(75, 85, 99, 0.3); /* 暗黑模式下的灰色，增加对比度 */
}

.skeleton-box::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.35),
    transparent
  );
  animation: skeleton-shimmer 2.5s infinite;
}

.dark .skeleton-box::after {
  background-image: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.03),
    transparent
  );
}

@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
