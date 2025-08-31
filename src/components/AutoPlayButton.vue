<template>
  <button
    class="auto-play-button"
    :class="{ 'is-playing': isAutoPlaying }"
    @click="toggleAutoPlay"
    :title="buttonTitle"
  >
    <svg
      v-if="!isAutoPlaying"
      class="w-4 h-4"
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
    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  import { ref, computed, onMounted, onUnmounted } from 'vue';

  const isAutoPlaying = ref(false);
  const scrollInterval = ref<number | null>(null);
  const musicAudio = ref<HTMLAudioElement | null>(null);
  const lastScrollTop = ref(0);
  const autoScrollStartTime = ref(0);

  // 计算按钮标题
  const buttonTitle = computed(() => {
    return isAutoPlaying.value ? '停止自动播放' : '开始自动播放';
  });

  // 获取音乐音频元素
  const getMusicAudio = () => {
    if (!musicAudio.value) {
      musicAudio.value = (window as any).musicAudio;
    }
    return musicAudio.value;
  };

  // 计算页面总高度
  const getPageHeight = () => {
    return Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
    );
  };

  // 计算滚动速度
  const calculateScrollSpeed = () => {
    const audio = getMusicAudio();
    if (!audio) return 0;

    const totalHeight = getPageHeight() - window.innerHeight;
    const audioDuration = audio.duration;

    // 确保音频时长有效
    if (audioDuration <= 0 || totalHeight <= 0) return 0;

    // 计算每秒滚动像素数
    return totalHeight / audioDuration;
  };

  // 开始自动播放
  const startAutoPlay = () => {
    const audio = getMusicAudio();
    if (!audio) {
      console.warn('音乐播放器未找到');
      return;
    }

    // 等待音频加载完成
    if (audio.readyState < 2) {
      audio.addEventListener('canplay', () => {
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
        console.log('自动播放开始');

        // 计算滚动速度
        const scrollSpeed = calculateScrollSpeed();
        if (scrollSpeed <= 0) {
          console.warn('无法计算滚动速度');
          return;
        }

        // 记录开始时间和初始滚动位置
        autoScrollStartTime.value = Date.now();
        lastScrollTop.value = window.pageYOffset;

        // 开始自动滚动
        const startTime = Date.now();
        const startScrollTop = window.pageYOffset;

        scrollInterval.value = window.setInterval(() => {
          const elapsed = (Date.now() - startTime) / 1000; // 秒
          const targetScrollTop = startScrollTop + scrollSpeed * elapsed;

          // 平滑滚动到目标位置
          window.scrollTo({
            top: Math.min(targetScrollTop, getPageHeight()),
            behavior: 'auto', // 使用auto确保平滑滚动
          });

          // 检查是否到达底部或音乐结束
          if (window.pageYOffset >= getPageHeight() - 10 || audio.ended) {
            stopAutoPlay();
          }
        }, 16); // 约60fps的更新频率
      })
      .catch((error: any) => {
        console.error('自动播放失败:', error);
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
    if (isAutoPlaying.value) {
      stopAutoPlay();
    }
  };

  // 监听用户滚动事件
  const handleUserScroll = () => {
    if (!isAutoPlaying.value) return;

    const currentScrollTop = window.pageYOffset;
    const scrollDifference = Math.abs(currentScrollTop - lastScrollTop.value);

    // 如果滚动距离超过阈值，认为是用户手动滚动
    if (scrollDifference > 15) {
      console.log('检测到用户手动滚动，停止自动播放');
      stopAutoPlay();
      return;
    }

    lastScrollTop.value = currentScrollTop;
  };

  // 监听页面卸载
  onUnmounted(() => {
    stopAutoPlay();

    // 清理滚动监听器
    window.removeEventListener('scroll', handleUserScroll);
  });

  // 监听音乐播放器状态变化
  onMounted(() => {
    // 等待音乐播放器初始化
    const checkMusicPlayer = () => {
      const audio = getMusicAudio();
      if (audio) {
        audio.addEventListener('ended', handleMusicEnded);
        // 监听音频加载完成事件
        audio.addEventListener('loadedmetadata', () => {
          console.log('音频元数据加载完成，时长:', audio.duration);
        });
      } else {
        setTimeout(checkMusicPlayer, 100);
      }
    };

    checkMusicPlayer();

    // 添加滚动监听器
    window.addEventListener('scroll', handleUserScroll, { passive: true });
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
