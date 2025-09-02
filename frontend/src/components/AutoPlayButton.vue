<template>
  <button
    class="auto-play-button"
    :class="{ 'is-playing': isAutoPlaying }"
    @click="toggleAutoPlay"
    :title="buttonTitle"
  >
    <svg
      v-if="!isAutoPlaying"
      class="w-4 h-4 md:w-4 md:h-4 sm:w-5 sm:h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z"
      />
    </svg>
    <svg
      v-else
      class="w-4 h-4 md:w-4 md:h-4 sm:w-5 sm:h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, onUnmounted } from "vue";

const isAutoPlaying = ref(false);
const scrollInterval = ref<number | null>(null);
const musicAudio = ref<HTMLAudioElement | null>(null);
const lastScrollTop = ref(0);
const autoScrollStartTime = ref(0);

// 计算按钮标题
const buttonTitle = computed(() => {
  return isAutoPlaying.value ? "停止自动播放" : "开始自动播放";
});

// 获取音乐音频元素
const getMusicAudio = () => {
  if (!musicAudio.value) {
    musicAudio.value = (window as any).musicAudio;
  }
  return musicAudio.value;
};

// 固定滚动速度（像素/秒）
const SCROLL_SPEED = 50; // 每秒滚动50像素

// 开始自动播放
const startAutoPlay = () => {
  const audio = getMusicAudio();
  if (!audio) {
    console.warn("音乐播放器未找到");
    return;
  }

  // 等待音频加载完成
  if (audio.readyState < 2) {
    audio.addEventListener("canplay", () => {
      startAutoPlayInternal();
    });
    return;
  }

  startAutoPlayInternal();
};

// 内部自动播放逻辑
const startAutoPlayInternal = () => {
  const audio = getMusicAudio();
  if (!audio) return;

  // 重置音频到开始位置
  audio.currentTime = 0;

  // 开始播放音乐
  audio
    .play()
    .then(() => {
      console.log("🎵 音乐开始播放，页面开始自动滚动");
      // 记录开始时间和初始滚动位置
      autoScrollStartTime.value = Date.now();
      lastScrollTop.value = window.pageYOffset;

      // 开始自动滚动
      const startTime = Date.now();
      const startScrollTop = window.pageYOffset;

      scrollInterval.value = window.setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000; // 秒
        const targetScrollTop = startScrollTop + SCROLL_SPEED * elapsed;

        // 平滑滚动到目标位置
        window.scrollTo({
          top: targetScrollTop,
          behavior: "auto", // 使用auto确保平滑滚动
        });

        // 检查是否到达页面底部
        const maxScrollTop =
          document.documentElement.scrollHeight - window.innerHeight;
        if (window.pageYOffset >= maxScrollTop - 10) {
          stopAutoPlay();
        }
      }, 16); // 约60fps的更新频率
    })
    .catch((error: any) => {
      console.error("自动播放失败:", error);
    });
};

// 停止自动播放
const stopAutoPlay = () => {
  if (scrollInterval.value) {
    clearInterval(scrollInterval.value);
    scrollInterval.value = null;
  }

  const audio = getMusicAudio();
  if (audio) {
    audio.pause();
  }

  isAutoPlaying.value = false;
};

// 切换自动播放状态
const toggleAutoPlay = () => {
  if (isAutoPlaying.value) {
    stopAutoPlay();
  } else {
    isAutoPlaying.value = true;
    startAutoPlay();
  }
};

// 监听音乐结束事件
const handleMusicEnded = () => {
  // 如果自动播放还在进行中，重新播放音乐
  if (isAutoPlaying.value) {
    const audio = getMusicAudio();
    if (audio) {
      console.log("🔄 音乐播放完毕，重新开始播放");
      audio.currentTime = 0; // 重置到开始位置
      audio.play().catch((error) => {
        console.error("音乐重新播放失败:", error);
      });
    }
  }
};

// 监听用户滚动事件
const handleUserScroll = () => {
  if (!isAutoPlaying.value) return;

  const currentScrollTop = window.pageYOffset;
  const scrollDifference = Math.abs(currentScrollTop - lastScrollTop.value);

  // 如果滚动距离超过阈值，认为是用户手动滚动
  if (scrollDifference > 15) {
    stopAutoPlay();
    return;
  }

  lastScrollTop.value = currentScrollTop;
};

// 监听页面卸载
onUnmounted(() => {
  stopAutoPlay();

  // 清理滚动监听器
  window.removeEventListener("scroll", handleUserScroll);
});

// 监听音乐播放器状态变化
onMounted(() => {
  // 等待音乐播放器初始化
  const checkMusicPlayer = () => {
    const audio = getMusicAudio();
    if (audio) {
      audio.addEventListener("ended", handleMusicEnded);
      // 监听音频加载完成事件
      audio.addEventListener("loadedmetadata", () => {});
    } else {
      setTimeout(checkMusicPlayer, 100);
    }
  };

  // 添加全局函数，供其他组件调用
  (window as any).setProgrammaticScroll = (isProgrammatic: boolean) => {
    isProgrammaticScroll.value = isProgrammatic;
    if (isProgrammatic) {
      // 程序化滚动时，短暂延迟后重置状态
      setTimeout(() => {
        isProgrammaticScroll.value = false;
      }, 1000);
    }
  };

  // 添加全局状态，供其他组件监听自动播放状态
  (window as any).isAutoPlaying = isAutoPlaying;
  checkMusicPlayer();

  // 添加滚动监听器
  window.addEventListener("scroll", handleUserScroll, { passive: true });
});
</script>

<style scoped>
.auto-play-button {
  @apply w-8 h-8 rounded-full flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all duration-300 border-none;
}

.auto-play-button.is-playing {
  @apply bg-red-500 text-white hover:bg-red-600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 减少动画偏好设置 */
@media (prefers-reduced-motion: reduce) {
  .auto-play-button.is-playing {
    animation: none;
  }
}
</style>
