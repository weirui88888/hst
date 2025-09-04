<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-[1100] grid place-items-center bg-black/60 overscroll-none"
    @wheel.prevent
    @touchmove.prevent
  >
    <div
      data-dialog
      class="upload-dialog w-[92vw] max-w-xl md:max-w-3xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-lg bg-neutral-100 dark:bg-neutral-900 p-4 shadow-lg border border-neutral-300 dark:border-neutral-700"
      @wheel.stop
      @touchmove.stop
    >
      <div class="flex items-center justify-between mb-3">
        <h3
          class="text-lg font-semibold text-neutral-800 dark:text-neutral-200"
        >
          {{
            isEdit
              ? UI_TEXTS.upload.editTitle || UI_TEXTS.upload.title
              : UI_TEXTS.upload.title
          }}
        </h3>
        <button
          @click="$emit('update:modelValue', false)"
          class="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-all duration-200 bg-none border-none"
          style="background: none; border: none"
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
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <form class="space-y-3" @submit.prevent="onSubmit">
        <div
          class="grid grid-cols-1 md:[grid-template-columns:4.5fr_7.5fr] gap-6 md:gap-6 items-start"
        >
          <!-- 左侧：媒体上传与所见即所得展示 -->
          <div class="md:order-1 space-y-3">
            <!-- 桌面端：所见即所得展示区（md及以上显示） -->
            <div
              class="hidden md:block relative rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 group"
              @dragover.prevent
              @drop.prevent="media.length > 0 ? undefined : handleDrop($event)"
            >
              <!-- 覆盖式文件选择，仅桌面端 -->
              <input
                type="file"
                accept="image/*"
                @change="onFiles"
                :disabled="media.length > 0"
                :class="[
                  'absolute inset-0 w-full h-full opacity-0 z-10',
                  media.length > 0 ? 'cursor-not-allowed' : 'cursor-pointer',
                ]"
                @click="media.length > 0 && $event.preventDefault()"
              />

              <!-- 预览/占位 -->
              <div class="w-full" :style="previewImageStyle">
                <div
                  class="w-full h-full"
                  :style="previewBackgroundStyle"
                ></div>
              </div>

              <!-- 占位提示（无图时显示） -->
              <div
                v-if="media.length === 0"
                class="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400 pointer-events-none select-none"
              >
                <svg
                  class="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span class="text-sm">{{
                  UI_TEXTS.upload.desktopUploadHint
                }}</span>
              </div>

              <!-- 删除按钮（有图时显示） -->
              <button
                v-if="media.length > 0"
                type="button"
                @click="removeMedia(0)"
                class="absolute top-2 right-2 z-20 w-7 h-7 bg-neutral-900/80 text-white rounded-full flex items-center justify-center hover:bg-neutral-800 transition-colors border-none"
                style="border: none"
                :title="UI_TEXTS.upload.deleteImage"
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- 移动端：所见即所得展示区（与桌面一致，置于顶部） -->
            <div
              class="md:hidden relative rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800"
              @dragover.prevent
              @drop.prevent="media.length > 0 ? undefined : handleDrop($event)"
            >
              <input
                type="file"
                accept="image/*"
                @change="onFiles"
                :disabled="media.length > 0"
                :class="[
                  'absolute inset-0 w-full h-full opacity-0 z-10',
                  media.length > 0 ? 'cursor-not-allowed' : 'cursor-pointer',
                ]"
                @click="media.length > 0 && $event.preventDefault()"
              />
              <div class="w-full" :style="previewImageStyle">
                <div
                  class="w-full h-full"
                  :style="previewBackgroundStyle"
                ></div>
              </div>
              <div
                v-if="media.length === 0"
                class="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400 pointer-events-none select-none"
              >
                <svg
                  class="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span class="text-sm">{{
                  UI_TEXTS.upload.mobileUploadHint
                }}</span>
              </div>
              <button
                v-if="media.length > 0"
                type="button"
                @click="removeMedia(0)"
                class="absolute top-2 right-2 z-20 w-8 h-8 bg-neutral-900/80 text-white rounded-full flex items-center justify-center hover:bg-neutral-800 transition-colors border-none"
                style="border: none"
                :title="UI_TEXTS.upload.deleteImage"
              >
                <svg
                  class="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- 右侧：表单输入区域 -->
          <div class="space-y-3 md:space-y-4 md:order-2">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <input
                  ref="titleInput"
                  v-model="title"
                  :placeholder="UI_TEXTS.upload.titlePlaceholder"
                  @focus="onTitleFocus"
                  @blur="onTitleBlur"
                  class="flex-1 px-0 py-2 border-0 bg-transparent text-xl md:text-2xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-200 outline-none"
                />
                <!-- Emoji 选择器 -->
                <EmojiPicker @emoji-select="insertEmoji" />
              </div>
              <div class="relative">
                <textarea
                  ref="textarea"
                  v-model="content"
                  rows="1"
                  :placeholder="UI_TEXTS.upload.contentPlaceholder"
                  @focus="onContentFocus"
                  @blur="onContentBlur"
                  class="w-full px-0 py-0 border-0 bg-transparent text-base leading-relaxed text-neutral-600 dark:text-neutral-300 outline-none resize-none"
                />
              </div>
            </div>
            <!-- 标签输入/展示 与 日期选择 同行两端布局（与故事章节展示一致） -->
            <div class="flex items-center gap-3">
              <div class="flex-1 min-w-0" ref="tagsBox">
                <input
                  v-if="tagsEditing"
                  v-model="tags"
                  @focus="beginTagsEdit"
                  @blur="endTagsEdit"
                  @keydown.enter.prevent="endTagsEdit"
                  @keydown.tab="endTagsEdit"
                  class="w-full px-0 py-2 border-0 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none"
                  :placeholder="UI_TEXTS.upload.tagsPlaceholder"
                />
                <div
                  v-else
                  class="flex items-center flex-wrap gap-2 cursor-text"
                  @click="beginTagsEdit"
                >
                  <span
                    v-for="(t, i) in parsedTags"
                    :key="i"
                    class="px-3 py-1 rounded-md bg-neutral-700 text-neutral-300 text-xs font-medium"
                  >
                    #{{ t }}
                  </span>
                  <span
                    v-if="parsedTags.length === 0"
                    class="text-sm text-neutral-400"
                  >
                    {{ UI_TEXTS.upload.tagsPlaceholder }}
                  </span>
                </div>
              </div>
              <div class="ml-auto">
                <DatePicker
                  v-model="date"
                  :model-config="{ type: 'string', mask: 'YYYY-MM-DD' }"
                  :is24hr="true"
                  :popover="{
                    visibility: 'click',
                    placement: 'bottom',
                    isFixed: true,
                  }"
                  color="orange"
                >
                  <template #default="{ inputValue, inputEvents }">
                    <input
                      :value="formatDateForDisplay(inputValue)"
                      v-on="inputEvents"
                      :placeholder="UI_TEXTS.upload.datePlaceholder"
                      class="px-0 py-2 border-0 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none w-[140px] text-right cursor-pointer"
                      readonly
                      inputmode="none"
                      autocomplete="off"
                    />
                  </template>
                </DatePicker>
              </div>
            </div>

            <div class="pt-2 space-y-3"></div>
          </div>
        </div>
      </form>
      <!-- 底部操作区：独占一行，靠右，底部间距与顶部一致（由容器 p-4 提供） -->
      <div class="flex items-center justify-end mt-3">
        <button
          type="button"
          :disabled="!isFormValid"
          @click="onSubmit()"
          :class="[
            'px-3 py-1.5 rounded-md font-medium transition-all duration-200 border-none shadow-sm',
            isFormValid
              ? 'text-white hover:shadow-md cursor-pointer'
              : 'bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed',
          ]"
          :style="isFormValid ? { backgroundColor: SITE_MAIN_COLOR } : {}"
        >
          {{
            props.isEdit
              ? UI_TEXTS.upload.updateButton || "调整"
              : UI_TEXTS.upload.saveButton
          }}
        </button>
      </div>
    </div>
    <!-- 移动端：大图遮罩预览（点击触发） -->
    <div
      v-if="previewItem"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1200] md:hidden overscroll-contain"
      @click="hidePreview"
      @wheel.prevent
      @touchmove.prevent
    >
      <div
        data-dialog
        class="relative w-[90vw] max-w-[560px] overflow-x-hidden overscroll-contain"
        @click.stop
      >
        <!-- 固定在预览窗口右上角的关闭按钮（不随内容滚动） -->
        <button
          @click="hidePreview"
          class="absolute top-3 right-3 w-8 h-8 bg-neutral-800 text-white rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors border-none"
          style="border: none"
          :title="UI_TEXTS.upload.closePreview"
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
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- 可滚动内容容器 -->
        <div
          class="max-h-[90vh] overflow-y-auto overscroll-contain"
          @wheel.stop
          @touchmove.stop
        >
          <div
            class="rounded-lg bg-neutral-100 dark:bg-neutral-900 shadow-2xl border border-neutral-300 dark:border-neutral-700 overflow-hidden"
          >
            <!-- 上：图片（等比，自适应宽度） -->
            <div class="w-full" :style="previewImageStyle">
              <div class="w-full h-full" :style="previewBackgroundStyle"></div>
            </div>
            <!-- 下：文本内容 -->
            <div class="p-4 space-y-2">
              <div
                class="text-base font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {{ title || "未命名标题" }}
              </div>
              <div class="flex items-center flex-wrap gap-2">
                <template v-if="(tags || '').trim()">
                  <span
                    v-for="(t, i) in tags
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)"
                    :key="i"
                    class="px-2 py-0.5 rounded-full text-xs bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                    >#{{ t }}</span
                  >
                </template>
                <span
                  class="ml-auto text-xs text-neutral-500 dark:text-neutral-400"
                >
                  {{ date || "未选择日期" }}
                </span>
              </div>
              <div
                class="text-sm leading-6 whitespace-pre-wrap text-neutral-800 dark:text-neutral-200"
              >
                {{ content || "（无内容）" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from "vue";
import { useTextareaAutosize } from "@vueuse/core";
import { useTimelineStore } from "../stores/timeline";
import type { MediaItem } from "../stores/timeline";
import { useThemeStore } from "../stores/theme";
import { SITE_MAIN_COLOR } from "../config/siteTheme";
import { UI_TEXTS } from "../config/texts";
import EmojiPicker from "./EmojiPicker.vue";

// Props定义
interface Props {
  modelValue: boolean;
  isEdit?: boolean;
  initialItem?: any | null;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const title = ref("");
const content = ref("");
// 使用 VueUse 的自适应高度文本域
const { textarea } = useTextareaAutosize({ input: content as unknown as any });
const titleInput = ref<HTMLInputElement | null>(null);
const tags = ref("");
const tagsEditing = ref(false);
const tagsBox = ref<HTMLElement | null>(null);

// 聚焦状态管理（用于记录最后聚焦的输入框）
const lastFocusedInput = ref<"title" | "content" | null>(null);

// 移动端滚动位置管理
const savedScrollPosition = ref(0);
const isMobile = ref(false);

function onGlobalMouseDown(ev: MouseEvent) {
  if (!tagsEditing.value) return;
  const el = tagsBox.value;
  if (!el) return;
  const target = ev.target as Node | null;
  if (target && el.contains(target)) return;
  endTagsEdit();
}

if (typeof window !== "undefined") {
  document.addEventListener("mousedown", onGlobalMouseDown, {
    passive: true,
  } as any);
}

// ESC键关闭弹窗
function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && props.modelValue) {
    emit("update:modelValue", false);
  }
}

const beginTagsEdit = () => {
  tagsEditing.value = true;
};

const endTagsEdit = () => {
  // 标准化：空白转逗号
  const normalized = (tags.value || "").replace(/\s+/g, ",");
  // 分割 -> 去空 -> 去重
  const parts = normalized
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p);
      unique.push(p);
    }
  }
  // 输入框失焦后切换为展示态，并把模型用空格连接，便于再次编辑
  tags.value = unique.join(" ");
  tagsEditing.value = false;
};

// 聚焦状态处理方法
const onTitleFocus = () => {
  lastFocusedInput.value = "title";
  handleInputFocus();
};

const onContentFocus = () => {
  lastFocusedInput.value = "content";
  handleInputFocus();
};

const onTitleBlur = () => {
  handleInputBlur();
};

const onContentBlur = () => {
  handleInputBlur();
};

// 处理输入框聚焦时的滚动问题
const handleInputFocus = () => {
  if (isMobile.value && typeof window !== "undefined") {
    // 保存当前滚动位置
    savedScrollPosition.value =
      window.pageYOffset || document.documentElement.scrollTop;

    // 使用更温和的方法防止页面滚动，不影响输入框光标
    // 添加touchmove事件监听器来阻止滚动
    const preventScroll = (e: TouchEvent) => {
      // 只阻止在弹窗外的滚动
      const target = e.target as Element;
      const dialog = document.querySelector("[data-dialog]");
      if (dialog && !dialog.contains(target)) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventScroll, { passive: false });

    // 存储事件监听器引用以便后续移除
    (document as any)._preventScrollHandler = preventScroll;
  }
};

// 处理输入框失焦时的滚动恢复
const handleInputBlur = () => {
  if (isMobile.value && typeof window !== "undefined") {
    // 移除滚动阻止事件监听器
    const preventScroll = (document as any)._preventScrollHandler;
    if (preventScroll) {
      document.removeEventListener("touchmove", preventScroll);
      delete (document as any)._preventScrollHandler;
    }

    // 恢复滚动位置
    window.scrollTo(0, savedScrollPosition.value);
  }
};

const parsedTags = computed(() => {
  const raw = (tags.value || "")
    .replace(/\s+/g, ",")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);
  // 去重，保持顺序
  const seen = new Set<string>();
  const result: string[] = [];
  for (const t of raw) {
    if (!seen.has(t)) {
      seen.add(t);
      result.push(t);
    }
  }
  return result;
});

const date = ref<Date | string>("");
const media = ref<MediaItem[]>([]);
// 用于左侧预览区域的本地 blob 地址，独立于 media.url（后者用于保存真实 OSS URL）
const previewLocalUrl = ref<string>("");

// 格式化日期为 YYYY-MM-DD，兼容字符串与 Date
const formatDateForDisplay = (dateValue: any) => {
  if (!dateValue) return "";
  if (dateValue instanceof Date) {
    if (isNaN(dateValue.getTime())) return "";
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, "0");
    const day = String(dateValue.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const s = String(dateValue);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const fileInput = ref<HTMLInputElement | null>(null);
const theme = useThemeStore();
const isDark = computed(() => theme.mode === "dark");
const previewItem = ref<MediaItem | null>(null);

watch(
  () => props.modelValue,
  (v: boolean) => {
    if (v) {
      if (props.isEdit && props.initialItem) {
        // 编辑模式：用初始数据回填
        const item = props.initialItem as any;
        title.value = item.title || "";
        content.value = item.content || "";
        tags.value = Array.isArray(item.tags)
          ? item.tags.join(" ")
          : item.tags || "";
        date.value = item.date ? new Date(item.date) : new Date();
        media.value = Array.isArray(item.media)
          ? item.media.map((m: any) => ({
              type: m.type,
              url: m.url,
              aspectRatio: m.aspectRatio,
            }))
          : [];
      } else {
        // 新增模式：初始化默认值
        title.value = "我的标题";
        content.value = `风吹过山谷，带来清晨的凉意，
一束光落在静谧的湖面，
像时间遗落的羽毛，轻轻颤动。
我们在世间奔走，
却常忘记抬头望一眼天边，
那缓慢移动的云，
早已替我们写下温柔的答复。`;
        tags.value = "可爱多 海参 曲奇";
        date.value = new Date();
        media.value = [];
      }
    }
  },
  { immediate: true },
);

// 监听弹窗状态，控制页面滚动
watch(
  () => props.modelValue,
  (isOpen: boolean) => {
    if (isOpen) {
      // 检测是否为移动端
      isMobile.value =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) || window.innerWidth <= 768;

      // 保存当前滚动位置
      if (typeof window !== "undefined") {
        savedScrollPosition.value =
          window.pageYOffset || document.documentElement.scrollTop;
      }

      // 禁止页面滚动
      if (typeof document !== "undefined") {
        document.body.style.overflow = "hidden";
      }
    } else {
      // 恢复页面滚动
      if (typeof document !== "undefined") {
        // 恢复正确的滚动设置
        document.documentElement.style.overflowX = "hidden";
        document.documentElement.style.overflowY = "auto";
        document.body.style.overflowX = "hidden";
        document.body.style.overflowY = "hidden";

        // 恢复滚动位置
        if (isMobile.value && typeof window !== "undefined") {
          // 使用 setTimeout 确保 DOM 更新完成后再恢复滚动位置
          setTimeout(() => {
            window.scrollTo(0, savedScrollPosition.value);
          }, 0);
        }
      }
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (typeof window !== "undefined") {
    // 添加ESC键监听
    document.addEventListener("keydown", handleKeydown);
  }
});

onUnmounted(() => {
  if (typeof document !== "undefined") {
    // 恢复正确的滚动设置
    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "hidden";

    // 清理可能残留的事件监听器
    const preventScroll = (document as any)._preventScrollHandler;
    if (preventScroll) {
      document.removeEventListener("touchmove", preventScroll);
      delete (document as any)._preventScrollHandler;
    }

    // 恢复滚动位置
    if (isMobile.value && typeof window !== "undefined") {
      window.scrollTo(0, savedScrollPosition.value);
    }
  }
  if (typeof window !== "undefined") {
    document.removeEventListener("mousedown", onGlobalMouseDown as any);
    // 移除ESC键监听
    document.removeEventListener("keydown", handleKeydown);
  }
});

function onFiles(e: Event) {
  const input = e.target as HTMLInputElement;
  const files = input.files ? Array.from(input.files) : [];
  media.value = [];

  for (const file of files) {
    // 只处理图片文件
    if (!file.type.startsWith("image/")) {
      continue;
    }

    const mediaItem: any = {
      type: "image",
      url: URL.createObjectURL(file),
    };

    // 检测图片比例
    const img = new Image();
    img.onload = () => {
      // 使用原始像素宽高，避免精度丢失
      const aspectRatio = `${img.width}/${img.height}`;
      const index = media.value.findIndex((m: any) => m.url === mediaItem.url);
      if (index !== -1) {
        // 仅保留三个字段
        const current = media.value[index] as any;
        media.value[index] = {
          type: current.type,
          url: current.url,
          aspectRatio,
        } as any;
      }
    };
    img.src = mediaItem.url;

    media.value.push(mediaItem);
    // 预览始终使用本地 blob，不受后续 media.url 替换影响
    previewLocalUrl.value = mediaItem.url;

    // 上传到阿里云 OSS（调用真实实例方法）
    (async () => {
      try {
        const { ossUploader } = await import("../utils/ossClient");
        const uploadRes: any = await ossUploader.upload({
          file,
          randomName: true,
        });
        const ossUrl = uploadRes?.ossSourceUrl || "";
        // 替换 media 内对应项的 url 为真实 OSS URL，保持仅三个字段
        const idx = media.value.findIndex(
          (m: any) =>
            m.type === "image" &&
            (m.url === previewLocalUrl.value || m.url === mediaItem.url),
        );
        if (idx !== -1 && ossUrl) {
          const aspectRatio = (media.value[idx] as any).aspectRatio;
          media.value[idx] = {
            type: "image",
            url: ossUrl,
            aspectRatio,
          } as any;
        }
      } catch (err: any) {
        console.error("[UploadDialog] OSS 上传失败:", err?.message || err);
        (window as any).$toast?.error("图片上传失败，请重试");
      }
    })();
  }
}

// 桌面端拖拽上传
function handleDrop(e: DragEvent) {
  const files = e.dataTransfer ? Array.from(e.dataTransfer.files) : [];
  const fakeInput = { files } as unknown as HTMLInputElement;
  onFiles({ target: fakeInput } as unknown as Event);
}

// 获取文件名
function getFileName(url: string): string {
  // 如果是blob URL，尝试从media数组中获取文件名
  const mediaItem = media.value.find((item: MediaItem) => item.url === url);
  if (mediaItem && (mediaItem as any).fileName) {
    return (mediaItem as any).fileName;
  }
  // 否则从URL中提取文件名
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 1] || "未知文件";
}

// 删除媒体文件
function removeMedia(index: number) {
  // 释放 blob URL（如果是本地预览地址）
  if (previewLocalUrl.value && previewLocalUrl.value.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(previewLocalUrl.value);
    } catch (error) {
      // 忽略错误
    }
  }
  previewLocalUrl.value = "";

  // 如果 media 中此项是 blob 地址，也尝试释放
  if (
    media.value[index] &&
    typeof media.value[index].url === "string" &&
    media.value[index].url.startsWith("blob:")
  ) {
    try {
      URL.revokeObjectURL(media.value[index].url);
    } catch (error) {
      // 忽略错误
    }
  }

  media.value.splice(index, 1);
}

const store = useTimelineStore();

// 重置表单到初始状态
function resetForm() {
  title.value = "";
  content.value = "";
  tags.value = "";
  date.value = new Date();
  media.value = [];
  previewLocalUrl.value = "";
}

// 计算表单是否有效
const isFormValid = computed(() => {
  return (
    title.value.trim() &&
    content.value.trim() &&
    date.value &&
    media.value.length > 0
  );
});

function onSubmit() {
  // 验证必填字段
  if (!title.value.trim()) {
    (window as any).$toast?.error("请填写标题");
    return;
  }
  if (!content.value.trim()) {
    (window as any).$toast?.error("请填写内容");
    return;
  }
  if (!date.value) {
    (window as any).$toast?.error("请选择日期");
    return;
  }
  if (media.value.length === 0) {
    (window as any).$toast?.error("请上传图片");
    return;
  }

  // 验证标签格式
  const tagList = parsedTags.value;
  if (tagList.length === 0) {
    (window as any).$toast?.error("请添加标签");
    return;
  }

  const payload = {
    title: title.value.trim(),
    content: content.value.trim(),
    tags: tagList,
    date: date.value instanceof Date ? date.value : new Date(date.value),
    media: media.value,
    isPublic: true, // 默认设置为公开可见
  } as any;

  if (props.isEdit && props.initialItem && props.initialItem.id) {
    // 编辑模式：调用更新，仅用调整文案
    store
      .updateItem(props.initialItem.id, payload as any)
      .then(() => {
        (window as any).$toast?.success(
          UI_TEXTS.toast.updateSuccess || "调整完成",
        );
      })
      .catch((err) => {
        console.error("更新时间轴项目失败", err);
        (window as any).$toast?.error(
          UI_TEXTS.toast.updateFailed || "调整失败，请重试",
        );
      });
  } else {
    // 新增模式：仅用录入成功文案
    store.addItem(payload as any);
    (window as any).$toast?.success(UI_TEXTS.toast.uploadSuccess);
  }

  // 关闭录入弹窗
  emit("update:modelValue", false);

  // 重置表单（编辑完也重置，避免下次遗留）
  resetForm();
}

// 计算预览图片样式（aspect-ratio容器）
const previewImageStyle = computed(() => {
  if (media.value.length === 0)
    return { aspectRatio: "16/9", width: "100%" } as any;
  const firstMedia = media.value[0];
  let ratio = "16/9";
  if (firstMedia.aspectRatio) {
    const parts = firstMedia.aspectRatio.split("/").map(Number);
    if (parts[0] > 0 && parts[1] > 0) {
      ratio = `${parts[0]}/${parts[1]}`;
    }
  }

  return { aspectRatio: ratio, width: "100%" } as any;
});

// 背景图样式，确保任何比例都cover填充
const previewBackgroundStyle = computed(() => {
  // 预览优先使用本地 blob，若不存在则退回 media[0].url
  const fallbackUrl =
    media.value.length > 0 && media.value[0].type === "image"
      ? media.value[0].url
      : "";
  const url = previewLocalUrl.value || fallbackUrl;
  return {
    backgroundImage: url ? `url('${url}')` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  } as any;
});

function showPreview(item: MediaItem) {
  previewItem.value = item;
}

function hidePreview() {
  previewItem.value = null;
}

// 插入emoji到最后聚焦的输入框中
function insertEmoji(emoji: string) {
  if (lastFocusedInput.value === "title" && titleInput.value) {
    // 插入到标题中
    const start = titleInput.value.selectionStart || 0;
    const end = titleInput.value.selectionEnd || 0;
    const before = title.value.substring(0, start);
    const after = title.value.substring(end);

    title.value = before + emoji + after;

    // 设置光标位置到emoji后面
    nextTick(() => {
      const newPosition = start + emoji.length;
      titleInput.value?.setSelectionRange(newPosition, newPosition);
      titleInput.value?.focus();
    });
  } else if (lastFocusedInput.value === "content" && textarea.value) {
    // 插入到内容中
    const start = textarea.value.selectionStart || 0;
    const end = textarea.value.selectionEnd || 0;
    const before = content.value.substring(0, start);
    const after = content.value.substring(end);

    content.value = before + emoji + after;

    // 设置光标位置到emoji后面
    nextTick(() => {
      const newPosition = start + emoji.length;
      textarea.value?.setSelectionRange(newPosition, newPosition);
      textarea.value?.focus();
    });
  } else {
    // 如果没有记录最后聚焦的输入框，默认插入到内容中
    if (textarea.value) {
      const start = textarea.value.selectionStart || 0;
      const end = textarea.value.selectionEnd || 0;
      const before = content.value.substring(0, start);
      const after = content.value.substring(end);

      content.value = before + emoji + after;

      // 设置光标位置到emoji后面
      nextTick(() => {
        const newPosition = start + emoji.length;
        textarea.value?.setSelectionRange(newPosition, newPosition);
        textarea.value?.focus();
      });
    }
  }
}

const previewContainerStyle = computed(() => {
  if (!previewItem.value || previewItem.value.type !== "image") {
    return {} as any;
  }
  const item = previewItem.value as any;
  if (item.aspectRatio) {
    const [width, height] = item.aspectRatio.split("/").map(Number);
    if (width && height) {
      const maxWidth = window.innerWidth * 0.9;
      const maxHeight = window.innerHeight * 0.9;
      const aspectRatio = width / height;
      let finalWidth: number, finalHeight: number;
      if (aspectRatio > 1) {
        finalWidth = Math.min(maxWidth, maxHeight * aspectRatio);
        finalHeight = finalWidth / aspectRatio;
      } else {
        finalHeight = Math.min(maxHeight, maxWidth / aspectRatio);
        finalWidth = finalHeight * aspectRatio;
      }
      return { width: `${finalWidth}px`, height: `${finalHeight}px` } as any;
    }
  }
  return { width: "264px", height: "346px" } as any;
});
</script>

<style scoped>
/* 左侧展示区已使用内联计算宽高以保持比例 */

/* 调整 DatePicker 弹出框的箭头位置 */
:deep(.vc-popover-content-wrapper) {
  transform-origin: top center !important;
}

:deep(.vc-popover-arrow) {
  left: 50% !important;
  transform: translateX(-50%) !important;
}
</style>
