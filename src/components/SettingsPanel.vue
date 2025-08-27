<template>
  <div class="relative">
    <!-- 设置面板 -->
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-full w-80 bg-neutral-100 dark:bg-neutral-900 shadow-2xl z-[60] transform transition-transform duration-300"
      :class="{ 'translate-x-0': isOpen, 'translate-x-full': !isOpen }"
    >
      <div class="p-6 h-full overflow-y-auto">
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
            <h2 class="text-base font-semibold text-neutral-800 dark:text-neutral-200">设置</h2>
          </div>
          <button
            @click="toggleSettings"
            class="text-neutral-400 hover:text-neutral-200 dark:text-neutral-500 dark:hover:text-neutral-800 transition-all duration-200 bg-none border-none"
            style="background: none; border: none"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <h3 class="text-lg font-medium text-neutral-800 dark:text-neutral-200">页面设置</h3>

            <!-- 动画开关 -->
            <div
              class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-600"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
                    页面动画
                  </h4>
                  <p class="text-xs text-neutral-600 dark:text-neutral-300">
                    开启或关闭页面过渡动画效果
                  </p>
                </div>
                <!-- 圆形checkbox开关 -->
                <div class="flex items-center">
                  <button
                    @click="toggleAnimationsEnabled"
                    class="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none overflow-hidden border-none"
                    :class="
                      animationsEnabled
                        ? 'bg-yellow-500 shadow-lg shadow-yellow-500/30'
                        : 'bg-neutral-600 dark:bg-neutral-500 hover:bg-neutral-500 dark:hover:bg-neutral-400'
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
                  <span class="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                    {{ animationsEnabled ? '开启' : '关闭' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 站点标题设置 -->
            <div
              class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-600"
            >
              <div>
                <h4 class="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
                  站点标题
                </h4>
                <p class="text-xs text-neutral-600 dark:text-neutral-300">修改页面左上角主标题</p>
              </div>
              <input
                v-model="localSiteTitle"
                @input="onSiteTitleInput"
                type="text"
                placeholder="我的故事"
                class="mt-3 w-full px-0 py-2 border-0 border-b border-neutral-300 dark:border-neutral-600 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          <!-- 时间轴设置 -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-neutral-800 dark:text-neutral-200">时间轴设置</h3>

            <!-- 时间轴位置开关 -->
            <div
              class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-600"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
                    时间轴位置
                  </h4>
                  <p class="text-xs text-neutral-600 dark:text-neutral-300">
                    {{ timeAxisPosition === 'left' ? '显示在左侧' : '显示在右侧' }}
                  </p>
                </div>
                <!-- 自定义开关 -->
                <div class="flex items-center">
                  <button
                    @click="setTimeAxisPosition(timeAxisPosition === 'left' ? 'right' : 'left')"
                    class="relative w-8 h-6 bg-neutral-600 dark:bg-neutral-500 rounded-sm transition-all duration-200 focus:outline-none border-none hover:bg-neutral-500 dark:hover:bg-neutral-400"
                  >
                    <div
                      class="absolute top-1/2 w-1 h-3/5 bg-yellow-500 rounded-sm shadow-sm transition-all duration-200 -translate-y-1/2"
                      :class="timeAxisPosition === 'right' ? 'left-6' : 'left-1'"
                    ></div>
                  </button>
                  <!-- 状态指示文字 -->
                  <span class="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                    {{ timeAxisPosition === 'right' ? '右侧' : '左侧' }}
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
                  <h4 class="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
                    季节标识
                  </h4>
                  <p class="text-xs text-neutral-600 dark:text-neutral-300">
                    在时间轴上显示春夏秋冬标识
                  </p>
                </div>
                <!-- 圆形checkbox开关 -->
                <div class="flex items-center">
                  <button
                    @click="toggleSeasonalIndicator"
                    class="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none overflow-hidden border-none"
                    :class="
                      seasonalIndicator
                        ? 'bg-yellow-500 shadow-lg shadow-yellow-500/30'
                        : 'bg-neutral-600 dark:bg-neutral-500 hover:bg-neutral-500 dark:hover:bg-neutral-400'
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
                  <span class="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                    {{ seasonalIndicator ? '开启' : '关闭' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 其他设置区域（预留） -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-neutral-800 dark:text-neutral-200">其他设置</h3>
            <div
              class="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-600"
            >
              <p class="text-sm text-neutral-600 dark:text-neutral-300">
                更多设置选项将在这里添加...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 背景遮罩 -->
    <div
      v-if="isOpen"
      @click="toggleSettings"
      class="fixed inset-0 bg-black bg-opacity-50 z-[55]"
    ></div>
  </div>
</template>

<script lang="ts">
  import { computed } from 'vue';

  export default {
    name: 'SettingsPanel',
    emits: [
      'update:seasonalIndicator',
      'update:animationsEnabled',
      'update:modelValue',
      'update:timeAxisPosition',
      'update:siteTitle',
    ],
    props: {
      seasonalIndicator: {
        type: Boolean,
        default: false,
      },
      animationsEnabled: {
        type: Boolean,
        default: true,
      },
      timeAxisPosition: {
        type: String,
        default: 'right',
      },
      modelValue: {
        type: Boolean,
        default: false,
      },
      siteTitle: {
        type: String,
        default: '我的故事',
      },
    },
    setup(props: any, { emit }: any) {
      const localSiteTitle = computed({
        get: () => props.siteTitle,
        set: (v: string) => emit('update:siteTitle', v),
      });
      const isOpen = computed({
        get: (): boolean => props.modelValue,
        set: (value: boolean) => emit('update:modelValue', value),
      });

      const toggleSettings = () => {
        isOpen.value = !isOpen.value;
      };

      const toggleSeasonalIndicator = () => {
        emit('update:seasonalIndicator', !props.seasonalIndicator);
      };

      const toggleAnimationsEnabled = () => {
        emit('update:animationsEnabled', !props.animationsEnabled);
      };

      const setTimeAxisPosition = (position: string) => {
        emit('update:timeAxisPosition', position);
      };

      let debounceTimer: number | undefined;
      const onSiteTitleInput = () => {
        if (debounceTimer) window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => {
          emit('update:siteTitle', String(localSiteTitle.value || '').trim());
        }, 500);
      };

      return {
        isOpen,
        toggleSettings,
        toggleSeasonalIndicator,
        toggleAnimationsEnabled,
        setTimeAxisPosition,
        onSiteTitleInput,
        localSiteTitle,
      };
    },
  };
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
