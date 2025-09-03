<template>
  <div class="relative">
    <!-- 设置面板 -->
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-full w-80 bg-neutral-100 dark:bg-neutral-900 shadow-2xl z-[60] transform transition-transform duration-300 flex flex-col"
      :class="{ 'translate-x-0': isOpen, 'translate-x-full': !isOpen }"
    >
      <div class="flex-1 overflow-y-auto p-6 pb-20">
        <!-- 面板头部 -->
        <div
          class="flex items-center justify-between mb-8 pb-4 border-b border-neutral-700 dark:border-neutral-600"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 text-neutral-800 dark:text-neutral-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <h2
              class="text-base font-semibold text-neutral-800 dark:text-neutral-200"
            >
              {{ UI_TEXTS.settings.title }}
            </h2>
          </div>
          <button
            @click="handleCloseSettings"
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

        <!-- 设置选项 -->
        <div class="space-y-6">
          <!-- 页面设置 -->
          <div class="space-y-4">
            <h3
              class="text-lg font-medium text-neutral-800 dark:text-neutral-200"
            >
              {{ UI_TEXTS.settings.pageSettings }}
            </h3>

            <!-- 动画开关 -->
            <div
              class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-600"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4
                    class="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1"
                  >
                    {{ UI_TEXTS.settings.pageAnimation.title }}
                  </h4>
                  <p class="text-xs text-neutral-600 dark:text-neutral-300">
                    {{ UI_TEXTS.settings.pageAnimation.description }}
                  </p>
                </div>
                <!-- 圆形checkbox开关 -->
                <div class="flex items-center">
                  <button
                    @click="toggleAnimationsEnabled"
                    class="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none overflow-hidden border-none"
                    :style="
                      animationsEnabled
                        ? {
                            backgroundColor: 'var(--site-main-color)',
                            boxShadow: `0 0 0 4px var(--site-main-color-30)`,
                          }
                        : {}
                    "
                    :class="
                      !animationsEnabled
                        ? 'bg-neutral-600 dark:bg-neutral-500 hover:bg-neutral-500 dark:hover:bg-neutral-400'
                        : ''
                    "
                  >
                    <!-- 选中状态的对勾图标 -->
                    <svg
                      v-if="animationsEnabled"
                      class="w-3 h-3 text-white transition-all duration-200 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <!-- 状态指示文字 -->
                  <span
                    class="ml-2 text-xs text-neutral-500 dark:text-neutral-400"
                  >
                    {{
                      animationsEnabled
                        ? UI_TEXTS.settings.pageAnimation.on
                        : UI_TEXTS.settings.pageAnimation.off
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 站点标题设置 -->
            <div
              class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-600"
            >
              <div>
                <h4
                  class="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1"
                >
                  {{ UI_TEXTS.settings.siteTitle.title }}
                </h4>
                <p class="text-xs text-neutral-600 dark:text-neutral-300">
                  {{ UI_TEXTS.settings.siteTitle.description }}
                </p>
              </div>
              <div class="mt-3 flex items-center gap-2">
                <input
                  v-model="localSiteTitle"
                  type="text"
                  :placeholder="UI_TEXTS.settings.siteTitle.placeholder"
                  class="flex-1 px-0 py-2 border-0 border-b border-neutral-300 dark:border-neutral-600 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none focus:border-neutral-400"
                />
              </div>
            </div>

            <!-- 时间轴开始文案设置 -->
            <div
              class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-600"
            >
              <div>
                <h4
                  class="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1"
                >
                  {{ UI_TEXTS.settings.endText.title }}
                </h4>
                <p class="text-xs text-neutral-600 dark:text-neutral-300">
                  {{ UI_TEXTS.settings.endText.description }}
                </p>
              </div>
              <div class="mt-3 flex items-center gap-2">
                <input
                  v-model="localSiteEndText"
                  type="text"
                  :placeholder="UI_TEXTS.settings.endText.placeholder"
                  class="flex-1 px-0 py-2 border-0 border-b border-neutral-300 dark:border-neutral-600 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none focus:border-neutral-400"
                />
              </div>
            </div>

            <!-- 尾声寄语设置 -->
            <div
              class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-600"
            >
              <div>
                <h4
                  class="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1"
                >
                  {{ UI_TEXTS.settings.epilogueMessage.title }}
                </h4>
                <p class="text-xs text-neutral-600 dark:text-neutral-300">
                  {{ UI_TEXTS.settings.epilogueMessage.description }}
                </p>
              </div>
              <div class="mt-3 space-y-3">
                <!-- 主寄语 -->
                <div>
                  <label
                    class="text-xs text-neutral-500 dark:text-neutral-400 mb-1 block"
                  >
                    {{ UI_TEXTS.settings.epilogueMessage.mainTitle }}
                  </label>
                  <input
                    v-model="localEpilogueMainTitle"
                    type="text"
                    :placeholder="
                      UI_TEXTS.settings.epilogueMessage.mainPlaceholder
                    "
                    class="w-full px-0 py-2 border-0 border-b border-neutral-300 dark:border-neutral-600 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none focus:border-neutral-400"
                  />
                </div>
                <!-- 副寄语 -->
                <div>
                  <label
                    class="text-xs text-neutral-500 dark:text-neutral-400 mb-1 block"
                  >
                    {{ UI_TEXTS.settings.epilogueMessage.subTitle }}
                  </label>
                  <input
                    v-model="localEpilogueSubTitle"
                    type="text"
                    :placeholder="
                      UI_TEXTS.settings.epilogueMessage.subPlaceholder
                    "
                    class="w-full px-0 py-2 border-0 border-b border-neutral-300 dark:border-neutral-600 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none focus:border-neutral-400"
                  />
                </div>
              </div>
            </div>

            <!-- 音乐自动播放设置 -->
            <div
              class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-600 hidden md:block"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4
                    class="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1"
                  >
                    {{ UI_TEXTS.settings.musicAutoPlay.title }}
                  </h4>
                  <p class="text-xs text-neutral-600 dark:text-neutral-300">
                    {{ UI_TEXTS.settings.musicAutoPlay.description }}
                  </p>
                  <!-- 提示信息 -->
                  <p
                    class="text-xs text-neutral-500 dark:text-neutral-400 mt-2 italic"
                  >
                    {{ UI_TEXTS.settings.musicAutoPlay.tip }}
                  </p>
                </div>
                <!-- 圆形checkbox开关 -->
                <div class="flex items-center">
                  <button
                    @click="toggleMusicAutoPlay"
                    class="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none overflow-hidden border-none"
                    :style="
                      musicAutoPlay
                        ? {
                            backgroundColor: 'var(--site-main-color)',
                            boxShadow: `0 0 0 4px var(--site-main-color-30)`,
                          }
                        : {}
                    "
                    :class="
                      !musicAutoPlay
                        ? 'bg-neutral-600 dark:bg-neutral-500 hover:bg-neutral-500 dark:hover:bg-neutral-400'
                        : ''
                    "
                  >
                    <!-- 选中状态的对勾图标 -->
                    <svg
                      v-if="musicAutoPlay"
                      class="w-3 h-3 text-white transition-all duration-200 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <!-- 状态指示文字 -->
                  <span
                    class="ml-2 text-xs text-neutral-500 dark:text-neutral-400"
                  >
                    {{
                      musicAutoPlay
                        ? UI_TEXTS.settings.musicAutoPlay.on
                        : UI_TEXTS.settings.musicAutoPlay.off
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 背景音乐选择（独立区域） -->
            <div
              class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-600"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4
                    class="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1"
                  >
                    {{ UI_TEXTS.settings.musicSelection.title }}
                  </h4>
                  <p class="text-xs text-neutral-600 dark:text-neutral-300">
                    {{ UI_TEXTS.settings.musicSelection.description }}
                  </p>
                  <div class="mt-3 space-y-0.5">
                    <div v-for="opt in SITE_MUSIC_OPTIONS" :key="opt.id">
                      <button
                        type="button"
                        class="w-full flex items-center justify-between py-1 pl-0 rounded-md transition-colors text-left bg-transparent border-none focus:outline-none hover:bg-transparent"
                        @click="setLocalMusic(opt.id)"
                        :aria-pressed="localMusic === opt.id"
                      >
                        <span
                          class="text-sm text-neutral-700 dark:text-neutral-300"
                          :style="
                            localMusic === opt.id
                              ? { color: 'var(--site-main-color)' }
                              : {}
                          "
                        >
                          {{ opt.name }}
                        </span>
                        <svg
                          v-if="localMusic === opt.id"
                          class="w-4 h-4 flex-shrink-0"
                          :style="{ color: 'var(--site-main-color)' }"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 时间轴设置 -->
          <div class="space-y-4 hidden md:block">
            <h3
              class="text-lg font-medium text-neutral-800 dark:text-neutral-200"
            >
              {{ UI_TEXTS.settings.timelineSettings }}
            </h3>

            <!-- 时间轴位置开关 -->
            <div
              class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-600"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4
                    class="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1"
                  >
                    {{ UI_TEXTS.settings.timelinePosition.title }}
                  </h4>
                  <p class="text-xs text-neutral-600 dark:text-neutral-300">
                    {{
                      timeAxisPosition === "left"
                        ? UI_TEXTS.settings.timelinePosition.leftDesc
                        : UI_TEXTS.settings.timelinePosition.rightDesc
                    }}
                  </p>
                </div>
                <!-- 自定义开关 -->
                <div class="flex items-center">
                  <button
                    @click="
                      setTimeAxisPosition(
                        timeAxisPosition === 'left' ? 'right' : 'left',
                      )
                    "
                    class="relative w-8 h-6 bg-neutral-600 dark:bg-neutral-500 rounded-sm transition-all duration-200 focus:outline-none border-none hover:bg-neutral-500 dark:hover:bg-neutral-400"
                  >
                    <div
                      class="absolute top-1/2 w-1 h-3/5 rounded-sm shadow-sm transition-all duration-200 -translate-y-1/2"
                      :style="{ backgroundColor: 'var(--site-main-color)' }"
                      :class="
                        timeAxisPosition === 'right' ? 'left-6' : 'left-1'
                      "
                    ></div>
                  </button>
                  <!-- 状态指示文字 -->
                  <span
                    class="ml-2 text-xs text-neutral-500 dark:text-neutral-400"
                  >
                    {{
                      timeAxisPosition === "right"
                        ? UI_TEXTS.settings.timelinePosition.right
                        : UI_TEXTS.settings.timelinePosition.left
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 季节标识开关 -->
            <div
              class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-600"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4
                    class="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1"
                  >
                    {{ UI_TEXTS.settings.seasonalIndicator.title }}
                  </h4>
                  <p class="text-xs text-neutral-600 dark:text-neutral-300">
                    {{ UI_TEXTS.settings.seasonalIndicator.description }}
                  </p>
                </div>
                <!-- 圆形checkbox开关 -->
                <div class="flex items-center">
                  <button
                    @click="toggleSeasonalIndicator"
                    class="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none overflow-hidden border-none"
                    :style="
                      seasonalIndicator
                        ? {
                            backgroundColor: 'var(--site-main-color)',
                            boxShadow: `0 0 0 4px var(--site-main-color-30)`,
                          }
                        : {}
                    "
                    :class="
                      !seasonalIndicator
                        ? 'bg-neutral-600 dark:bg-neutral-500 hover:bg-neutral-500 dark:hover:bg-neutral-400'
                        : ''
                    "
                  >
                    <!-- 选中状态的对勾图标 -->
                    <svg
                      v-if="seasonalIndicator"
                      class="w-3 h-3 text-white transition-all duration-200 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <!-- 状态指示文字 -->
                  <span
                    class="ml-2 text-xs text-neutral-500 dark:text-neutral-400"
                  >
                    {{
                      seasonalIndicator
                        ? UI_TEXTS.settings.pageAnimation.on
                        : UI_TEXTS.settings.pageAnimation.off
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 背景遮罩 -->
    <div
      v-if="isOpen"
      @click="handleCloseSettings"
      class="fixed inset-0 bg-black bg-opacity-50 z-[55]"
    ></div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, ref, watch } from "vue";
import { UI_TEXTS } from "../config/texts";
import { SITE_MUSIC_OPTIONS } from "../config/musicCatalog";

const emit = defineEmits([
  "update:seasonalIndicator",
  "update:animationsEnabled",
  "update:modelValue",
  "update:timeAxisPosition",
  "update:siteTitle",
  "update:siteEndText",
  "update:epilogueMainTitle",
  "update:epilogueSubTitle",
  "update:musicAutoPlay",
  "update:siteMusic",
]);

const props = defineProps<{
  seasonalIndicator?: boolean;
  animationsEnabled?: boolean;
  timeAxisPosition?: string;
  modelValue?: boolean;
  siteTitle?: string;
  siteEndText?: string;
  epilogueMainTitle?: string;
  epilogueSubTitle?: string;
  musicAutoPlay?: boolean;
  siteMusic?: "you-are-the-reason" | "bleeding-love";
}>();

// 本地状态，用于跟踪配置是否已修改
const hasChanges = ref(false);

// 本地状态，用于在编辑过程中保持用户输入的值
const localInputs = ref({
  siteTitle: props.siteTitle || "多多与贺贺的青春",
  siteEndText: props.siteEndText || "十二年的陪伴，是最长情的告白",
  epilogueMainTitle: props.epilogueMainTitle || "流转的岁月里，爱从未缺席",
  epilogueSubTitle:
    props.epilogueSubTitle ||
    "贺贺与多多的旅程，漫长而璀璨，写满温柔与期待，在日复一日的陪伴里，生长出最温柔的力量",
});
const localMusic = ref(props.siteMusic || "you-are-the-reason");

// 监听props变化，只在面板打开时更新本地状态
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      // 面板打开时，同步props到本地状态
      localInputs.value.siteTitle = props.siteTitle || "多多与贺贺的青春";
      localInputs.value.siteEndText =
        props.siteEndText || "十二年的陪伴，是最长情的告白";
      localInputs.value.epilogueMainTitle =
        props.epilogueMainTitle || "流转的岁月里，爱从未缺席";
      localInputs.value.epilogueSubTitle =
        props.epilogueSubTitle ||
        "贺贺与多多的旅程，漫长而璀璨，写满温柔与期待，在日复一日的陪伴里，生长出最温柔的力量";
      localMusic.value = props.siteMusic || "you-are-the-reason";
    }
  },
);

const localSiteTitle = computed({
  get: () => localInputs.value.siteTitle,
  set: (v: string) => {
    // 直接使用用户输入的值，不应用默认值
    localInputs.value.siteTitle = v;
    emit("update:siteTitle", v);
    hasChanges.value = true;
  },
});

const localSiteEndText = computed({
  get: () => localInputs.value.siteEndText,
  set: (v: string) => {
    // 直接使用用户输入的值，不应用默认值
    localInputs.value.siteEndText = v;
    emit("update:siteEndText", v);
    hasChanges.value = true;
  },
});

const localEpilogueMainTitle = computed({
  get: () => localInputs.value.epilogueMainTitle,
  set: (v: string) => {
    // 直接使用用户输入的值，不应用默认值
    localInputs.value.epilogueMainTitle = v;
    emit("update:epilogueMainTitle", v);
    hasChanges.value = true;
  },
});

const localEpilogueSubTitle = computed({
  get: () => localInputs.value.epilogueSubTitle,
  set: (v: string) => {
    // 直接使用用户输入的值，不应用默认值
    localInputs.value.epilogueSubTitle = v;
    emit("update:epilogueSubTitle", v);
    hasChanges.value = true;
  },
});

const musicAutoPlay = computed({
  get: () => props.musicAutoPlay ?? true,
  set: (v: boolean) => {
    emit("update:musicAutoPlay", v);
    hasChanges.value = true;
  },
});
const isOpen = computed({
  get: (): boolean => !!props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const toggleSettings = () => {
  isOpen.value = !isOpen.value;
};

const handleCloseSettings = () => {
  // 关闭设置面板时，如果有修改则触发更新
  if (hasChanges.value) {
    // 触发父组件的更新逻辑
    emit("update:modelValue", false);
    hasChanges.value = false;
  } else {
    isOpen.value = false;
  }
};

const toggleSeasonalIndicator = () => {
  emit("update:seasonalIndicator", !props.seasonalIndicator);
  hasChanges.value = true;
};

const toggleAnimationsEnabled = () => {
  emit("update:animationsEnabled", !props.animationsEnabled);
  hasChanges.value = true;
};

const toggleMusicAutoPlay = () => {
  emit("update:musicAutoPlay", !props.musicAutoPlay);
  hasChanges.value = true;
};

const setLocalMusic = (m: "you-are-the-reason" | "bleeding-love") => {
  localMusic.value = m;
  emit("update:siteMusic", m);
  hasChanges.value = true;
};

const setTimeAxisPosition = (position: string) => {
  emit("update:timeAxisPosition", position);
  hasChanges.value = true;
};

// 监听面板打开状态，重置修改标记
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      hasChanges.value = false;
    }
  },
);
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* 设置面板动画 */
.settings-panel-enter-active,
.settings-panel-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.settings-panel-enter-from,
.settings-panel-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
