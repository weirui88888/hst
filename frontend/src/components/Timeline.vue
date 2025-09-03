<template>
  <div>
    <section class="relative py-8">
      <!-- 时间轴线 -->
      <div
        class="fixed top-1/2 -translate-y-1/2 z-50 hidden md:block transition-all duration-300"
        :class="props.timeAxisPosition === 'left' ? 'left-8' : 'right-8'"
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
              props.timeAxisPosition === 'left'
                ? 'left-6 text-right'
                : 'right-6 text-left',
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
          v-for="(item, index) in visibleItems"
          :key="`${item.id}-${props.animationsEnabled}`"
          :ref="(el) => setSectionRef(el, index)"
          class="relative will-change-transform"
          :class="[
            props.animationsEnabled ? 'transition-all duration-500' : '',
            articleClass(index),
          ]"
        >
          <!-- 故事内容 -->
          <div
            class="relative max-w-4xl mx-auto"
            :class="[
              props.animationsEnabled
                ? 'transition-all duration-700 ease-out'
                : '',
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
                <div
                  class="w-full rounded-2xl overflow-hidden md:overflow-visible p-0 md:p-8"
                >
                  <div
                    :style="imageFrameStyle(item)"
                    class="timeline-image w-full rounded-xl overflow-hidden"
                    :class="[
                      props.animationsEnabled
                        ? 'transition-all duration-300 animations-enabled'
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
                  <div class="group relative">
                    <h3
                      class="text-xl md:text-2xl font-semibold mb-2 tracking-tight text-neutral-800 dark:text-neutral-200 md:group-hover:pr-32 transition-all duration-200"
                    >
                      {{ item.title }}
                      <span
                        v-if="item.isPinned"
                        class="ml-2 align-middle text-[11px] font-medium text-orange-600 dark:text-orange-400 select-none"
                      >
                        📌置顶
                      </span>
                    </h3>

                    <!-- 桌面端按钮组 - 悬停标题时显示 -->
                    <div
                      v-if="isMasterMode && showMobileButtons"
                      class="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:flex pointer-events-none md:pointer-events-auto"
                    >
                      <!-- 编辑按钮 -->
                      <button
                        @click="onEditButtonClick(item)"
                        class="w-6 h-6 rounded-full flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-200 border-none shadow-sm"
                        :title="'编辑故事'"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      <!-- 可见性控制按钮 -->
                      <button
                        @click="onVisibilityToggleClick(item)"
                        class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 border-none shadow-sm"
                        :class="[
                          item.isPublic
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50 hover:text-green-700 dark:hover:text-green-300'
                            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-800/50 hover:text-orange-700 dark:hover:text-orange-300',
                        ]"
                        :title="item.isPublic ? '设为私密' : '设为公开'"
                      >
                        <svg
                          v-if="item.isPublic"
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <svg
                          v-else
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M1 1l22 22"
                          />
                        </svg>
                      </button>

                      <!-- 置顶按钮 -->
                      <button
                        @click="onPinToggleClick(item)"
                        class="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200 border shadow-sm"
                        :style="pinButtonVars"
                        :class="
                          item.isPinned
                            ? 'bg-[color:var(--pin-bg)] hover:bg-[color:var(--pin-bg-hover)] border-none'
                            : 'bg-[color:var(--pin-bg)] hover:bg-[color:var(--pin-bg-hover)] border-none'
                        "
                        :title="item.isPinned ? '取消置顶' : '设为置顶'"
                      >
                        <svg
                          v-if="item.isPinned"
                          class="w-4 h-4"
                          :style="{ color: 'var(--pin-color)' }"
                          fill="currentColor"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                          />
                        </svg>
                        <svg
                          v-else
                          class="w-4 h-4"
                          :style="{ color: 'var(--pin-color)' }"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                          />
                        </svg>
                      </button>

                      <!-- 删除按钮 -->
                      <button
                        @click="onDeleteButtonClick(item)"
                        class="w-6 h-6 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 border-none shadow-sm"
                        :title="'删除故事'"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div
                    class="text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap"
                  >
                    {{ item.content }}
                  </div>
                </div>

                <div class="flex flex-wrap gap-2 items-center">
                  <span
                    class="px-3 py-1 rounded-md bg-neutral-700 text-neutral-300 text-xs font-medium"
                    v-for="tag in item.tags"
                    :key="tag"
                    >#{{ tag }}</span
                  >
                  <span
                    class="ml-auto text-sm text-neutral-500 dark:text-neutral-400 font-medium"
                    >{{ formatDate(item.date) }}</span
                  >

                  <!-- 移动端按钮组 - 放在标签这一行的最下面 -->
                  <div
                    v-if="isMasterMode && showMobileButtons"
                    class="w-full flex justify-end gap-2 mt-3 hidden md:hidden"
                  >
                    <!-- 编辑按钮 -->
                    <button
                      @click="onEditButtonClick(item)"
                      class="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all duration-200 border-none shadow-sm"
                      :title="'编辑故事'"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <!-- 可见性控制按钮 -->
                    <button
                      @click="onVisibilityToggleClick(item)"
                      class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border-none shadow-sm"
                      :class="[
                        item.isPublic
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50 hover:text-green-700 dark:hover:text-green-300'
                          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-800/50 hover:text-orange-700 dark:hover:text-orange-300',
                      ]"
                      :title="item.isPublic ? '设为私密' : '设为公开'"
                    >
                      <svg
                        v-if="item.isPublic"
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 1l22 22"
                        />
                      </svg>
                    </button>

                    <!-- 置顶按钮 -->
                    <button
                      @click="onPinToggleClick(item)"
                      class="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 border shadow-sm"
                      :style="pinButtonVars"
                      :class="
                        item.isPinned
                          ? 'bg-[color:var(--pin-bg)] hover:bg-[color:var(--pin-bg-hover)] border-none'
                          : 'bg-[color:var(--pin-bg)] hover:bg-[color:var(--pin-bg-hover)] border-none'
                      "
                      :title="item.isPinned ? '取消置顶' : '设为置顶'"
                    >
                      <svg
                        v-if="item.isPinned"
                        class="w-5 h-5"
                        :style="{ color: 'var(--pin-color)' }"
                        fill="currentColor"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-5 h-5"
                        :style="{ color: 'var(--pin-color)' }"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                    </button>

                    <!-- 删除按钮 -->
                    <button
                      @click="onDeleteButtonClick(item)"
                      class="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 border-none shadow-sm"
                      :title="'删除故事'"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
        <!-- 时间轴结尾标记 -->
        <div class="mt-20 flex flex-col items-center select-none">
          <div class="h-px w-24 bg-neutral-300/50 dark:bg-neutral-700/60"></div>
          <div
            class="mt-3 text-sm tracking-wide text-neutral-400 dark:text-neutral-500"
          >
            『
            {{ settingsStore.siteEndText || UI_TEXTS.settings.endText.default }}
            』
          </div>
        </div>
      </div>
    </section>
    <UploadDialog
      v-model="editDialogOpen"
      :isEdit="true"
      :initialItem="editItem"
    />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
type CSSProperties = Partial<CSSStyleDeclaration>;
import MediaPreview from "./MediaPreview.vue";
import UploadDialog from "./UploadDialog.vue";
import { useSettingsStore } from "../stores/settings";
import { useTimelineStore } from "../stores/timeline";
import { useToast } from "../utils/toast";
import { UI_TEXTS } from "../config/texts";
import { SITE_MAIN_COLOR } from "../config/siteTheme";

const props = defineProps<{
  items?: any[];
  seasonalIndicator?: boolean;
  animationsEnabled?: boolean;
  timeAxisPosition?: string;
}>();

// 根据可见性过滤显示的故事章节
const visibleItems = computed(() => {
  if (!props.items) return [];

  // 主人模式下显示所有故事章节
  if (isMasterMode.value) {
    return props.items;
  }

  // 非主人模式下只显示公开的故事章节
  return props.items.filter((item) => item.isPublic !== false);
});

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
const timelineStore = useTimelineStore();
const toast = useToast();

// 主人模式：使用 Pinia 同步；保留 storage 事件用于跨标签页同步
const isMasterMode = computed<boolean>({
  get: () => settingsStore.isMasterMode,
  set: (val: boolean) => settingsStore.setMasterMode(val),
});
// 仅移动端：当沉浸式预览关闭时，显示图片左下角按钮；开启时隐藏
const showMobileButtons = computed<boolean>(() => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  if (!isMobile) return true; // 桌面端逻辑不变
  return !settingsStore.immersivePreviewEnabled; // 关闭沉浸式时才显示
});

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "hst_app_is_master") {
      settingsStore.setMasterMode(!!localStorage.getItem("hst_app_is_master"));
    }
  });
}

// 置顶按钮颜色（图标/背景/边框/hover）基于站点主色，使用透明度区分
const pinButtonVars = computed(() => {
  const hex = SITE_MAIN_COLOR || "#ea580c";
  const rgb = hex.replace("#", "");
  const r = parseInt(rgb.substring(0, 2), 16) || 234;
  const g = parseInt(rgb.substring(2, 4), 16) || 88;
  const b = parseInt(rgb.substring(4, 6), 16) || 12;
  return {
    "--pin-color": `rgba(${r}, ${g}, ${b}, 0.95)`,
    "--pin-bg": `rgba(${r}, ${g}, ${b}, 0.12)`,
    "--pin-bg-hover": `rgba(${r}, ${g}, ${b}, 0.22)`,
    "--pin-border": `rgba(${r}, ${g}, ${b}, 0.35)`,
  } as CSSProperties;
});

// 主人模式下，点击编辑按钮触发编辑
const editDialogOpen = ref(false);
const editItem = ref<any | null>(null);

function onEditButtonClick(item: any) {
  if (!isMasterMode.value) return;
  editItem.value = item;
  editDialogOpen.value = true;
}

async function onVisibilityToggleClick(item: any) {
  if (!isMasterMode.value) return;

  try {
    // 切换可见性
    const newVisibility = !item.isPublic;

    // 调用更新API
    await timelineStore.updateItem(item.id, {
      isPublic: newVisibility,
    });

    // 更新本地数据
    item.isPublic = newVisibility;

    // 显示成功提示
    toast.success(newVisibility ? "已设为公开" : "已设为私密");
  } catch (error) {
    console.error("切换可见性失败:", error);
    toast.error("操作失败，请重试");
  }
}

async function onDeleteButtonClick(item: any) {
  if (!isMasterMode.value) return;

  try {
    // 直接调用删除API
    await timelineStore.deleteItem(item.id);

    // 删除成功toast提示
    toast.success(UI_TEXTS.toast.deleteSuccess);
  } catch (error) {
    console.error("删除故事失败:", error);
    // 删除失败toast提示
    toast.error(UI_TEXTS.toast.deleteFailed);
  }
}

async function onPinToggleClick(item: any) {
  if (!isMasterMode.value) return;

  try {
    // 切换置顶状态
    const newPinState = !item.isPinned;

    // 调用更新API
    await timelineStore.updateItem(item.id, {
      isPinned: newPinState,
    });

    // 更新本地数据
    item.isPinned = newPinState;

    // 显示成功提示
    toast.success(newPinState ? "已设为置顶" : "已取消置顶");
  } catch (error) {
    console.error("切换置顶状态失败:", error);
    toast.error("操作失败，请重试");
  }
}

const timeAxisPositionStyle = computed(() => {
  if (
    activeIndex.value === -1 ||
    !visibleItems.value ||
    visibleItems.value.length === 0
  ) {
    return { top: "50%" } as CSSProperties;
  }

  const baseProgress = activeIndex.value / (visibleItems.value.length - 1);
  const ratioPad = Math.max(0, Math.min(0.49, axisEndPaddingRatio.value));
  const mappedProgress = ratioPad + baseProgress * (1 - 2 * ratioPad);

  const { minY, range } = getAxisMetrics();
  const topPosition = minY + mappedProgress * range;
  return { top: `${topPosition}px` } as CSSProperties;
});

const timeAxisLabelStyle = computed(() => {
  return {
    width: "120px",
    display: "inline-block",
    fontVariantNumeric: "tabular-nums",
  } as CSSProperties;
});

const currentTimeDisplay = computed(() => {
  if (
    activeIndex.value === -1 ||
    !visibleItems.value ||
    visibleItems.value.length === 0
  ) {
    return "";
  }
  const currentItem = visibleItems.value[activeIndex.value];
  const date = currentItem?.date || "";
  if ((props.seasonalIndicator ?? false) && date) {
    const month = getMonthFromDate(date);
    const season = getSeasonFromMonth(month);
    return `${season} ${formatDate(date)}`;
  }
  return formatDate(date);
});

const setSectionRef = (el: any, idx: number) => {
  if (el) sectionRefs.value[idx] = el as HTMLElement;
};

const startDrag = (event: MouseEvent | TouchEvent) => {
  event.preventDefault();
  isDragging.value = true;

  const timelineAxis = document.querySelector(".timeline-axis") as HTMLElement;
  if (timelineAxis) {
    const rect = timelineAxis.getBoundingClientRect();
    timelineAxisTop.value = rect.top;
    timelineAxisHeight.value = rect.height;
  }

  const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;
  dragStartY.value = clientY;

  document.addEventListener("mousemove", onDrag as any);
  document.addEventListener(
    "touchmove",
    onDrag as any,
    { passive: false } as any,
  );
  document.addEventListener("mouseup", stopDrag as any);
  document.addEventListener("touchend", stopDrag as any);

  document.body.style.userSelect = "none";
};

const onDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;
  event.preventDefault();
  const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;
  const relativeY = clientY - timelineAxisTop.value;
  const { minY, maxY, range } = getAxisMetrics();
  const relativeDragY = Math.max(minY, Math.min(maxY, relativeY));
  const rawProgress = range > 0 ? (relativeDragY - minY) / range : 0;
  const ratioPad = Math.max(0, Math.min(0.49, axisEndPaddingRatio.value));
  const baseProgress = Math.max(
    0,
    Math.min(1, (rawProgress - ratioPad) / (1 - 2 * ratioPad)),
  );
  const newIndex = Math.round(
    baseProgress * ((visibleItems.value?.length || 0) - 1),
  );
  if (
    newIndex !== activeIndex.value &&
    newIndex >= 0 &&
    newIndex < (visibleItems.value?.length || 0)
  ) {
    activeIndex.value = newIndex;
  }
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", onDrag as any);
  document.removeEventListener("touchmove", onDrag as any);
  document.removeEventListener("mouseup", stopDrag as any);
  document.removeEventListener("touchend", stopDrag as any);
  if (activeIndex.value >= 0) {
    scrollToStory(activeIndex.value);
  }
  document.body.style.userSelect = "";
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
    window.scrollBy({ top: scrollOffset, behavior: "auto" });
  }
};

const handleTimelineClick = (event: MouseEvent) => {
  if (isDragging.value) return;
  const timelineAxis = document.querySelector(".timeline-axis") as HTMLElement;
  if (!timelineAxis) return;
  const rect = timelineAxis.getBoundingClientRect();
  const clickY = event.clientY - rect.top;
  const { minY, maxY, range } = getAxisMetrics();
  const relativeClickY = Math.max(minY, Math.min(maxY, clickY));
  const rawProgress = range > 0 ? (relativeClickY - minY) / range : 0;
  const ratioPad = Math.max(0, Math.min(0.49, axisEndPaddingRatio.value));
  const baseProgress = Math.max(
    0,
    Math.min(1, (rawProgress - ratioPad) / (1 - 2 * ratioPad)),
  );
  const newIndex = Math.round(
    baseProgress * ((visibleItems.value?.length || 0) - 1),
  );
  if (newIndex >= 0 && newIndex < (visibleItems.value?.length || 0)) {
    activeIndex.value = newIndex;
    scrollToStory(newIndex);
  }
};

const getAxisMetrics = () => {
  const axisEl = document.querySelector(".timeline-axis") as HTMLElement | null;
  const lineEl = document.querySelector(
    ".timeline-axis-line",
  ) as HTMLElement | null;
  if (!axisEl || !lineEl) {
    const fallbackHeight = 256;
    const pxPad = Math.max(
      0,
      Math.min(fallbackHeight / 2 - 1, axisPaddingPx.value),
    );
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
  if (
    bottomGap <= edgeThreshold &&
    activeIndex.value !== (visibleItems.value?.length || 0) - 1
  ) {
    activeIndex.value = (visibleItems.value?.length || 0) - 1;
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
    return "opacity-100";
  }
  return index === activeIndex.value ? "opacity-100" : "opacity-60";
};

const storyClass = (index: number) => {
  if (!(props.animationsEnabled ?? true)) {
    return "scale-100 translate-y-0";
  }
  if (index === activeIndex.value) {
    return "scale-[1.02] md:scale-[1.05] -translate-y-4 md:-translate-y-6";
  }
  return "scale-100 translate-y-0";
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
  return imageOnLeft ? "" : "md:grid-flow-col-dense";
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
  return imageOnLeft ? "order-1 md:order-1" : "order-1 md:order-2";
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
  return imageOnLeft ? "order-2 md:order-2" : "order-2 md:order-1";
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
    direction: imageOnLeft ? "right" : "left",
    skew: 4,
    rotate: 1,
    distance: 80,
    ease: "power3.out",
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
    direction: imageOnLeft ? "left" : "right",
    distance: 60,
    ease: "power2.out",
    scale: 0.98,
    stagger: 0.08,
  };
};

const imageFrameStyle = (item: any) => {
  const media = item.media?.[0];
  let aspectRatio: string | undefined = undefined;
  if (media?.aspectRatio) {
    const [width, height] = media.aspectRatio.split("/").map(Number);
    if (width && height) {
      aspectRatio = `${width}/${height}`;
    }
  }
  const isNarrow = typeof window !== "undefined" && window.innerWidth <= 450;
  if (isNarrow) {
    const style: CSSProperties = {
      transform: "none",
      boxShadow: "none",
    };
    return style;
  }
  const rotation = getRandomRotation(item.id);
  const shadowOffset = getRandomShadowOffset(item.id);
  const style: CSSProperties = {
    boxShadow: `${shadowOffset.x}px ${shadowOffset.y}px 20px rgba(0, 0, 0, 0.3)`,
    transition: "all 0.3s ease-out",
  };
  // 使用 CSS 变量承载角度，悬停放大时保持原角度
  (style as any)["--rotation"] = `${rotation}deg`;
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
  const seed = itemId + "aspect";
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const randomValue = Math.abs(hash) % 100;
  if (randomValue < 35) {
    return "16/9";
  } else if (randomValue < 55) {
    return "4/3";
  } else if (randomValue < 70) {
    return "1/1";
  } else if (randomValue < 80) {
    return "3/2";
  } else if (randomValue < 88) {
    return "5/4";
  } else if (randomValue < 94) {
    return "3/4";
  } else if (randomValue < 98) {
    return "21/9";
  } else {
    return "2/3";
  }
};

const getRandomShadowOffset = (itemId: string) => {
  const seed = itemId + "shadow";
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

const getMonthFromDate = (dateValue: Date | string) => {
  if (dateValue instanceof Date) {
    return dateValue.getMonth() + 1;
  }

  const date = new Date(dateValue);
  if (!isNaN(date.getTime())) {
    return date.getMonth() + 1;
  }
  const monthMatch = dateValue.match(/(\d{1,2})[-/](\d{1,2})/);
  if (monthMatch) {
    return parseInt(monthMatch[2]);
  }
  const isoMatch = dateValue.match(/(\d{4})-(\d{1,2})/);
  if (isoMatch) {
    return parseInt(isoMatch[2]);
  }
  return 1;
};

const getSeasonFromMonth = (month: number) => {
  if (month >= 3 && month <= 5) {
    return "🌱春";
  } else if (month >= 6 && month <= 8) {
    return "🌞夏";
  } else if (month >= 9 && month <= 11) {
    return "🍂秋";
  } else {
    return "❄️冬";
  }
};

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

onMounted(() => {
  updateActive();
  window.addEventListener("scroll", onScroll as any, { passive: true } as any);
  window.addEventListener(
    "resize",
    () => {
      const axisEl = document.querySelector(
        ".timeline-axis",
      ) as HTMLElement | null;
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
  window.removeEventListener("scroll", onScroll as any);
  window.removeEventListener("resize", onScroll as any);
  if (rafId.value) cancelAnimationFrame(rafId.value);
  stopDrag();
});
</script>

<style scoped>
/* 图片倾斜效果增强 */
.timeline-image {
  transform-origin: center center;
  /* 默认状态保持原角度 */
  transform: rotate(var(--rotation, 0deg));
  backface-visibility: hidden;
}

/* 悬停时的动画效果 - 只在动画开启时生效 */
.timeline-image.animations-enabled:hover {
  transform: scale(1.06) rotate(var(--rotation, 0deg)) !important;
  box-shadow: var(--shadow-x, 0px) var(--shadow-y, 0px) 15px rgba(0, 0, 0, 0.3) !important;
  z-index: 10;
}

/* 确保图片在倾斜时不会超出容器 */
.overflow-visible {
  overflow: visible !important;
}

/* 添加一些微妙的背景装饰 - 只在动画开启时生效 */
.timeline-image::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
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

/* 标题悬停编辑按钮样式 */
.group:hover button {
  transform: scale(1.05);
}

/* 移动端强制隐藏所有编辑按钮 */
@media (max-width: 767px) {
  .group button {
    display: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  /* 确保移动端标题不会因为悬停而改变padding */
  .group:hover h3 {
    padding-right: 0 !important;
  }
}

/* 确保按钮在悬停时有平滑的过渡效果 */
.group button {
  transition: all 0.2s ease;
}

/* 暗色主题下编辑按钮的阴影效果 */
@media (prefers-color-scheme: dark) {
  .timeline-image button {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
}

/* 浅色主题下编辑按钮的阴影效果 */
@media (prefers-color-scheme: light) {
  .timeline-image button {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}
</style>
