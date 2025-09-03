<template>
  <div class="music-player-wrapper">
    <!-- 左下角的CD -->
    <div
      class="cd-mini"
      :class="{ rotating: isPlaying }"
      @click="togglePlay"
      @mouseenter="handleMiniCDHover"
      :style="cssVariables"
    >
      <div class="cd-circle"></div>
    </div>

    <!-- 完整的音乐播放器 -->
    <div
      class="music-player"
      :class="{ 'is-playing': isPlaying, show: showFullPlayer }"
      :style="cssVariables"
      @mouseleave="showFullPlayer = false"
    >
      <div class="left">
        <div class="circle"></div>
        <div class="cd-container">
          <div class="cd" :class="{ rotating: isPlaying }" @click="togglePlay">
            <div class="cd-circle"></div>
          </div>

          <!-- 进度条 -->
          <div class="progress-container">
            <div class="progress-row">
              <div
                class="progress-bar"
                @click="handleProgressClick"
                ref="progressBarRef"
              >
                <div
                  class="progress-fill"
                  :style="{ width: progressPercent + '%' }"
                ></div>
                <div
                  class="progress-thumb"
                  :style="{ left: progressPercent + '%' }"
                ></div>
              </div>
              <div class="progress-line"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="p-circle"></div>
        <div class="player" @mouseenter="handlePlayerHover(true)">
          <hr class="first" />
          <hr class="secound" />
          <hr class="third" />
          <div class="square"></div>
        </div>
        <div class="last">
          <div></div>
          <div></div>
        </div>
        <div class="mora"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useThemeStore } from "../stores/theme";
import { useSettingsStore } from "../stores/settings";
import {
  generateMusicPlayerCSSVariables,
  MUSIC_PLAYER_THEME,
} from "../config/musicPlayerTheme";
import { getMusicSrcById } from "../config/musicCatalog";

const theme = useThemeStore();
const settings = useSettingsStore();
const isPlaying = ref(false);
const isHovering = ref(false);
const isClickDisabled = ref(false);
const audioRef = ref<HTMLAudioElement | null>(null);
const hasUserInteracted = ref(false);
const progressBarRef = ref<HTMLDivElement | null>(null);
const currentTime = ref(0);
const duration = ref(0);
const isDragging = ref(false);
const showFullPlayer = ref(false);
const savedRotationAngle = ref(0);
const animationStartTime = ref(0);

// 音频控制函数
const playAudio = () => {
  if (audioRef.value && hasUserInteracted.value) {
    // 确保音频不是静音的
    audioRef.value.muted = false;

    audioRef.value
      .play()
      .then(() => {})
      .catch((error) => {
        console.error("播放失败:", error);
        // 如果播放失败，尝试静音播放然后取消静音
        if (error.name === "NotAllowedError") {
          audioRef.value!.muted = true;
          audioRef
            .value!.play()
            .then(() => {
              audioRef.value!.muted = false;
            })
            .catch((mutedError) => {
              console.error("静音播放也失败:", mutedError);
            });
        }
      });
  }
};

const pauseAudio = () => {
  if (audioRef.value) {
    audioRef.value.pause();
  }
};

const togglePlay = () => {
  // 防止快速连续点击
  if (isClickDisabled.value) {
    return;
  }

  // 设置用户交互标志 - 这是第一次真正的用户交互
  hasUserInteracted.value = true;

  // 禁用点击
  isClickDisabled.value = true;

  isPlaying.value = !isPlaying.value;

  if (isPlaying.value) {
    playAudio();
  } else {
    pauseAudio();
    isHovering.value = false; // 停止播放时重置悬停状态
  }

  // 1秒后重新启用点击
  setTimeout(() => {
    isClickDisabled.value = false;
  }, 1000);
};

const handlePlayerHover = (hovering: boolean) => {
  // 只有在用户已经通过点击CD进行过交互后，hover才有效果
  if (hovering && !isPlaying.value && hasUserInteracted.value) {
    isPlaying.value = true;
    playAudio();
  }
  isHovering.value = hovering;
};

const handleMiniCDHover = () => {
  // 只在桌面端显示完整播放器
  if (window.innerWidth > 768) {
    showFullPlayer.value = true;
  }
};

// 停止旋转动画
const stopRotation = () => {
  // 计算当前旋转角度并保存
  const elapsed = Date.now() - animationStartTime.value;
  const currentAngle = ((elapsed * 45) / 1000) % 360; // 每8秒转360度
  savedRotationAngle.value = (savedRotationAngle.value + currentAngle) % 360;

  // 立即应用正确的角度，防止动画继续
  const cdElements = document.querySelectorAll(".cd, .cd-mini");
  cdElements.forEach((el) => {
    (el as HTMLElement).style.transform =
      `rotate(${savedRotationAngle.value}deg)`;
  });
};

// 监听音频事件
const handleAudioEnded = () => {
  isPlaying.value = false;
  isHovering.value = false;
  stopRotation();
};

const handleAudioPlay = () => {
  isPlaying.value = true;
  animationStartTime.value = Date.now();
};

const handleAudioPause = () => {
  // 先计算当前旋转角度并保存
  const elapsed = Date.now() - animationStartTime.value;
  const currentAngle = ((elapsed * 45) / 1000) % 360; // 每8秒转360度
  savedRotationAngle.value = (savedRotationAngle.value + currentAngle) % 360;

  // 立即应用正确的角度，防止动画继续
  const cdElements = document.querySelectorAll(".cd, .cd-mini");
  cdElements.forEach((el) => {
    (el as HTMLElement).style.transform =
      `rotate(${savedRotationAngle.value}deg)`;
  });

  // 然后停止播放状态
  isPlaying.value = false;
};

const handleTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime;
  }
};

const handleLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration;
  }
};

// 根据站点音乐ID更新音源，不重建Audio对象
const setAudioSource = (key: string) => {
  if (!audioRef.value) return;
  const src = getMusicSrcById(key);
  const shouldResume = isPlaying.value;
  try {
    audioRef.value.src = src;
    audioRef.value.load();
    if (shouldResume && hasUserInteracted.value) {
      playAudio();
    }
  } catch (err) {
    console.error("切换音源失败:", err);
  }
};

// 组件挂载时创建音频元素
onMounted(() => {
  const key = settings.siteMusic || "you-are-the-reason";
  const src = getMusicSrcById(key);
  audioRef.value = new Audio(src);

  // 设置音频属性以支持自动播放
  audioRef.value.muted = false; // 确保音频不是静音的
  audioRef.value.volume = 0.5; // 设置适中的音量

  // 添加音频加载事件监听
  audioRef.value.addEventListener("loadstart", () => {});

  audioRef.value.addEventListener("canplay", () => {});

  audioRef.value.addEventListener("canplaythrough", () => {});

  audioRef.value.addEventListener("error", (e) => {
    console.error("音频加载错误:", e);
    console.error("错误详情:", audioRef.value?.error);
  });

  audioRef.value.addEventListener("ended", handleAudioEnded);
  audioRef.value.addEventListener("play", handleAudioPlay);
  audioRef.value.addEventListener("pause", handleAudioPause);
  audioRef.value.addEventListener("timeupdate", handleTimeUpdate);
  audioRef.value.addEventListener("loadedmetadata", handleLoadedMetadata);
  audioRef.value.loop = false; // 不循环播放，支持自动播放功能

  // 预加载音频
  audioRef.value.load();

  // 将音频元素暴露到全局，供其他组件使用
  (window as any).musicAudio = audioRef.value;

  // 添加点击事件监听器，确保用户交互后可以播放
  const handleDocumentClick = () => {
    hasUserInteracted.value = true;
    document.removeEventListener("click", handleDocumentClick);
  };

  document.addEventListener("click", handleDocumentClick);

  // 添加滚动监听器来启用音频播放（仅桌面端且设置开启时）
  const handleScroll = () => {
    // 移动端不自动播放，需要用户手动交互
    if (window.innerWidth <= 768) {
      // 移除滚动监听器，避免重复触发
      window.removeEventListener("scroll", handleScroll);
      return;
    }

    // 检查设置是否开启自动播放
    if (!settings.musicAutoPlay) {
      // 移除滚动监听器，避免重复触发
      window.removeEventListener("scroll", handleScroll);
      return;
    }

    if (!hasUserInteracted.value) {
      hasUserInteracted.value = true;

      // 自动开始播放
      isPlaying.value = true;
      playAudio();
      // 移除滚动监听器，避免重复触发
      window.removeEventListener("scroll", handleScroll);
    }
  };

  window.addEventListener("scroll", handleScroll);

  // 组件卸载时清理事件监听器
  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
    document.removeEventListener("click", handleDocumentClick);
  });
});

// 监听站点音乐配置变化，动态切换音源
watch(
  () => settings.siteMusic,
  (newKey, oldKey) => {
    if (!newKey || newKey === oldKey) return;
    setAudioSource(newKey);
  },
);

// 组件卸载时清理音频
onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.removeEventListener("ended", handleAudioEnded);
    audioRef.value.removeEventListener("play", handleAudioPlay);
    audioRef.value.removeEventListener("pause", handleAudioPause);
    audioRef.value.removeEventListener("timeupdate", handleTimeUpdate);
    audioRef.value.removeEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.value.pause();
    audioRef.value = null;
  }

  // 清理滚动监听器
  window.removeEventListener("scroll", () => {});
});

// 进度百分比计算
const progressPercent = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

// 进度条点击处理
const handleProgressClick = (event: MouseEvent) => {
  if (!progressBarRef.value || !audioRef.value) return;

  const rect = progressBarRef.value.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percent = (clickX / rect.width) * 100;
  const newTime = (percent / 100) * duration.value;

  audioRef.value.currentTime = newTime;
  currentTime.value = newTime;
};

// 生成CSS变量
const cssVariables = computed(() => {
  const vars = generateMusicPlayerCSSVariables(theme.mode === "dark");
  return {
    ...vars,
    "--saved-angle": `${savedRotationAngle.value}deg`,
  };
});
</script>

<style scoped>
.music-player-wrapper {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 50;
}

/* 左下角的迷你CD */
.cd-mini {
  width: 60px;
  height: 60px;
  border: 3px solid var(--music-cd-border);
  border-radius: 50%;
  background-image: var(--music-cd-background-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.05s ease-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.cd-mini:not(.rotating) {
  transition: none;
}

.cd-mini.rotating {
  animation: rotateFromSaved 8s linear infinite;
}

.cd-mini:not(.rotating) {
  animation: none !important;
  animation-play-state: paused !important;
}

.cd-mini:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.cd-mini .cd-circle {
  height: 8px !important;
  width: 8px !important;
  border: 2px solid var(--music-control-border, #475569) !important;
  border-radius: 50% !important;
  background-color: var(--music-bg-color, #f8fafc) !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  z-index: 1 !important;
  margin: 0 !important;
  float: none !important;
}

/* 完整的音乐播放器 */
.music-player {
  height: 200px;
  width: 250px;
  border: 5px solid var(--music-border-color);
  border-radius: 8px;
  background-color: var(--music-bg-color);
  position: absolute;
  bottom: 80px;
  left: 0;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
}

.music-player.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* 使用CSS变量的颜色系统 */
.music-player .circle,
.music-player .player .p-circle,
.music-player .last div,
.music-player .mora {
  background-color: var(--music-control-bg);
  border-color: var(--music-control-border);
}

.music-player .cd-right,
.music-player .cd-right-small,
.music-player .cd-left,
.music-player .cd-left-small {
  border-color: transparent var(--music-decoration-lines) transparent
    transparent;
}

.music-player .cd-left,
.music-player .cd-left-small {
  border-color: transparent transparent transparent
    var(--music-decoration-lines);
}

.music-player .cd hr,
.music-player .player .first,
.music-player .secound,
.music-player .third {
  background-color: var(--music-decoration-lines);
}

.music-player .square {
  background-color: var(--music-control-bg);
  border-color: var(--music-control-border);
}

.music-player .cd-circle {
  background-color: var(--music-bg-color);
  border-color: var(--music-decoration-accents);
}

.left {
  float: left;
  width: 70%;
  position: relative;
}

.right {
  float: right;
  width: 30%;
  position: relative;
}

.cd {
  height: 150px;
  width: 150px;
  border: 4px solid var(--music-cd-border);
  border-radius: 50%;
  background-image: var(--music-cd-background-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: transform 0.05s ease-out;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.cd:not(.rotating) {
  transition: none;
}

.cd.rotating {
  animation: rotateFromSaved 8s linear infinite;
}

.cd:not(.rotating) {
  animation: none !important;
  animation-play-state: paused !important;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotateFromSaved {
  from {
    transform: rotate(var(--saved-angle, 0deg));
  }
  to {
    transform: rotate(calc(var(--saved-angle, 0deg) + 360deg));
  }
}

/* 添加播放状态的视觉反馈 */
.music-player.is-playing .cd {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.circle {
  height: 15px;
  width: 15px;
  float: left;
  border: 3px solid var(--music-control-border, #475569);
  border-radius: 50%;
  background-color: var(--music-control-bg, #ffffff);
  margin: 7px 0 0 7px;
  position: absolute;
  z-index: 10;
}

.cd-circle {
  height: 15px;
  width: 15px;
  float: left;
  border: 4px solid var(--music-control-border, #475569);
  border-radius: 50%;
  background-color: var(--music-bg-color, #f8fafc);
  margin: 64px 0 0 65px;
  position: absolute;
}

.cd-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 10px 0 0 10px;
}

.player {
  position: absolute;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
}

.player:hover,
.music-player.is-playing .player {
  margin-left: -30px;
  transform: rotateZ(30deg);
  transition: all 0.5s ease-in-out;
}

/* 确保player回到原位的动画优先级更高 */
.music-player:not(.is-playing) .player {
  margin-left: 0;
  transform: rotateZ(0deg);
  transition: all 0.5s ease-in-out;
}

.p-circle {
  height: 13px;
  width: 13px;
  border: 3px solid var(--music-control-border, #475569);
  border-radius: 50%;
  background-color: var(--music-control-bg, #ffffff);
  margin: 21px 0 0 40px;
  position: absolute;
  z-index: 10;
  transition: all 0.5s ease-in-out;
}

.player:hover ~ .p-circle,
.music-player.is-playing .p-circle {
  margin-top: 30px;
}

.player .first {
  width: 20px;
  height: 4px;
  background-color: var(--music-control-border, #475569);
  border: 0;
  margin: 20px 0 0 27px;
  position: absolute;
  transform: rotate(-45deg);
  border-radius: 5px;
}

.secound {
  background-color: var(--music-control-border, #475569);
  border: 0;
  margin: 60px 0px 0px -4px;
  height: 4px;
  width: 70px;
  transform: rotate(90deg);
}

.third {
  width: 20px;
  height: 4px;
  background-color: var(--music-control-border, #475569);
  border: 0;
  margin: 36px 0 0 15px;
  position: absolute;
  transform: rotate(-45deg);
  border-radius: 5px;
}

.square {
  height: 10px;
  width: 20px;
  border: 4px solid var(--music-control-border, #475569);
  background-color: var(--music-control-bg, #ffffff);
  transform: rotate(-45deg);
  border-radius: 5px;
  margin: 42px 0 0 -2px;
}

.last div {
  height: 15px;
  width: 15px;
  border: 3px solid var(--music-control-border, #475569);
  border-radius: 50%;
  background-color: var(--music-control-bg, #ffffff);
  margin: 137px 0px -127px 48px;
}

.mora {
  height: 60px;
  width: 15px;
  border: 4px solid var(--music-control-border, #475569);
  background-color: var(--music-control-bg, #ffffff);
  border-radius: 5px;
  margin: -3px 0 0 46px;
}

/* 进度条样式 */
.progress-container {
  position: absolute;
  bottom: -30px;
  left: 0;
  width: 150px; /* 与CD宽度保持一致 */
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 20px 0 10px;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  position: relative;
  height: 5px;
  flex: 1;
  background-color: var(--music-progress-bg, rgba(0, 0, 0, 0.1));
  border-radius: 2px;
  cursor: pointer;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--music-progress-fill, var(--music-decoration-lines));
  border-radius: 2px;
  transition: width 0.1s ease;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  background-color: var(--music-progress-thumb-bg, #ffffff);
  border: 1px solid var(--music-progress-thumb-border, #475569);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: left 0.1s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.progress-thumb:hover {
  transform: translate(-50%, -50%) scale(1.3);
}

.progress-line {
  width: 20px;
  height: 5px;
  background-color: var(--music-progress-bg, rgba(0, 0, 0, 0.1));
  border-radius: 2px;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .music-player-wrapper {
    bottom: 15px;
    left: 15px;
  }

  .cd-mini {
    width: 50px;
    height: 50px;
  }

  .cd-mini .cd-circle {
    height: 6px;
    width: 6px;
  }

  /* 移动端隐藏完整播放器 */
  .music-player {
    display: none;
  }
}
</style>
