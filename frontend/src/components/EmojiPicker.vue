<template>
  <div class="emoji-picker-container">
    <!-- Emoji 触发按钮 -->
    <button
      @click="togglePicker"
      class="emoji-trigger-btn"
      type="button"
      :title="UI_TEXTS.emojiPicker.triggerTitle"
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
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>

    <!-- Emoji 选择器弹窗 -->
    <div
      v-if="isPickerVisible"
      class="emoji-picker-popup"
      ref="pickerContainer"
    >
      <div class="emoji-picker-header">
        <span class="emoji-picker-title">{{ UI_TEXTS.emojiPicker.title }}</span>
        <button @click="closePicker" class="emoji-picker-close" type="button">
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
      <div class="emoji-picker-content" ref="pickerContent">
        <div v-if="isLoading" class="emoji-loading">
          <div class="loading-spinner"></div>
          <span>加载中...</span>
        </div>
        <div v-else-if="error" class="emoji-error">
          <span>加载失败，请重试</span>
        </div>
        <!-- Emoji 选择器将在这里渲染 -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useThemeStore } from "../stores/theme";
import { UI_TEXTS } from "../config/texts";

// Props
interface Props {
  onEmojiSelect?: (emoji: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  onEmojiSelect: () => {},
});

// 响应式数据
const isPickerVisible = ref(false);
const isLoading = ref(false);
const error = ref(false);
const isInitializing = ref(false);
const pickerContainer = ref<HTMLElement | null>(null);
const pickerContent = ref<HTMLElement | null>(null);
const pickerInstance = ref<any>(null);

// 主题
const theme = useThemeStore();

// 切换选择器显示状态
const togglePicker = () => {
  if (isPickerVisible.value) {
    // 如果已经可见，直接关闭
    isPickerVisible.value = false;
    destroyPicker();
  } else {
    // 如果不可见，显示并初始化
    isPickerVisible.value = true;
    error.value = false;
  }
};

// 关闭选择器
const closePicker = () => {
  isPickerVisible.value = false;
  destroyPicker();
};

// 监听弹窗显示状态，当显示时初始化选择器
watch(isPickerVisible, (visible) => {
  if (visible) {
    // 使用多重nextTick确保DOM完全渲染
    nextTick(() => {
      nextTick(() => {
        initPicker();
      });
    });
  }
});

// 初始化 Emoji 选择器
const initPicker = async () => {
  isInitializing.value = true;

  // 使用querySelector直接查找元素，避免ref引用问题
  const contentElement = document.querySelector(".emoji-picker-content");

  if (!contentElement) {
    console.error("Picker content element not found in DOM");
    error.value = true;
    isInitializing.value = false;
    return;
  }

  isLoading.value = true;
  error.value = false;

  try {
    // 动态导入 emoji-mart
    const { Picker, init } = await import("emoji-mart");

    // 获取远程数据
    const response = await fetch(
      "https://cdn.jsdelivr.net/npm/@emoji-mart/data",
    );
    const data = await response.json();

    // 初始化数据
    init({ data });

    // 创建选择器实例
    pickerInstance.value = new Picker({
      data,
      categories: [
        "frequent",
        "people",
        "nature",
        "foods",
        "activity",
        "places",
        "objects",
        "symbols",
        "flags",
      ],
      onEmojiSelect: (emoji: any) => {
        // 触发父组件的回调
        props.onEmojiSelect(emoji.native);
        closePicker();
      },
      locale: "zh",
      // 主题配置
      theme: theme.mode === "dark" ? "dark" : "light",
    });

    // 直接添加到DOM
    if (contentElement && pickerInstance.value) {
      contentElement.appendChild(pickerInstance.value);
      isLoading.value = false;
      isInitializing.value = false;
    } else {
      throw new Error("Failed to append picker to DOM");
    }
  } catch (err) {
    console.error("Failed to initialize emoji picker:", err);
    error.value = true;
    isLoading.value = false;
    isInitializing.value = false;
  }
};

// 销毁选择器
const destroyPicker = () => {
  if (pickerInstance.value) {
    try {
      // 尝试从父元素中移除
      const parent = pickerInstance.value.parentNode;
      if (parent) {
        parent.removeChild(pickerInstance.value);
      }
    } catch (error) {
      // 忽略错误，可能已经移除了
    }
    pickerInstance.value = null;
  }
  isLoading.value = false;
  error.value = false;
};

// 点击外部关闭选择器
const handleClickOutside = (event: MouseEvent) => {
  // 如果正在初始化，不处理点击外部事件
  if (isInitializing.value) {
    return;
  }

  if (isPickerVisible.value && pickerContainer.value) {
    const isInside = pickerContainer.value.contains(event.target as Node);
    if (!isInside) {
      closePicker();
    }
  }
};

// 生命周期
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  destroyPicker();
});
</script>

<style scoped>
.emoji-picker-container {
  position: relative;
  display: inline-block;
}

.emoji-trigger-btn {
  @apply w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 border-none;
  @apply text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200;
  @apply hover:bg-neutral-100 dark:hover:bg-neutral-800;
  background: none;
}

.emoji-picker-popup {
  @apply fixed z-[1300];
  @apply bg-white dark:bg-neutral-800 rounded-lg shadow-lg border;
  @apply border-neutral-200 dark:border-neutral-700;
  width: 370px;
  max-height: 500px;
  overflow: hidden;
  /* 居中显示 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.emoji-picker-header {
  @apply flex items-center justify-between p-3 border-b;
  @apply border-neutral-200 dark:border-neutral-700;
}

.emoji-picker-title {
  @apply text-sm font-medium text-neutral-800 dark:text-neutral-200;
}

.emoji-picker-close {
  @apply w-6 h-6 flex items-center justify-center rounded-md transition-all duration-200 border-none;
  @apply text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300;
  @apply hover:bg-neutral-100 dark:hover:bg-neutral-700;
  background: none;
}

.emoji-picker-content {
  @apply p-2;
  min-height: 300px;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .emoji-picker-popup {
    width: 100vw;
    max-width: 370px;
    max-height: 75vh;
  }

  .emoji-picker-content {
    min-height: 350px;
  }

  .emoji-trigger-btn {
    @apply w-10 h-10;
  }

  .emoji-trigger-btn svg {
    @apply w-6 h-6;
  }

  .emoji-picker-close {
    @apply w-8 h-8;
  }

  .emoji-picker-close svg {
    @apply w-8 h-8;
  }
}

/* 加载状态样式 */
.emoji-loading {
  @apply flex flex-col items-center justify-center py-8 text-neutral-500 dark:text-neutral-400;
}

.loading-spinner {
  @apply w-6 h-6 border-2 border-neutral-300 dark:border-neutral-600 border-t-transparent rounded-full animate-spin mb-2;
}

/* 错误状态样式 */
.emoji-error {
  @apply flex items-center justify-center py-8 text-red-500 dark:text-red-400;
}

/* 确保选择器内容样式正确 */
:deep(.emoji-picker-content *) {
  @apply text-neutral-800 dark:text-neutral-200;
}

/* 暗黑主题下的选择器样式调整 */
:deep(.emoji-picker-content .emoji-mart) {
  @apply bg-transparent;
}

:deep(.emoji-picker-content .emoji-mart .emoji-mart-category-label) {
  @apply text-neutral-600 dark:text-neutral-400;
}

:deep(.emoji-picker-content .emoji-mart .emoji-mart-emoji) {
  @apply hover:bg-neutral-100 dark:hover:bg-neutral-700;
}
</style>
