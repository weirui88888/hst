<template>
  <div>
    <header class="sticky top-0 z-50 backdrop-blur bg-neutral-900/80 border-b border-neutral-800">
      <div class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">
        <h1 class="text-lg font-semibold">我的故事</h1>
        <div class="flex items-center gap-3">
          <button class="i-carbon-sun dark:i-carbon-moon text-xl" @click="toggle" :title="title"></button>
          <button class="px-2 py-1 rounded-md border border-neutral-700 text-sm text-neutral-300 hover:border-neutral-600" @click="toggleAnim">{{ animLabel }}</button>
          <button class="px-3 py-1 rounded-md bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700" @click="openForm">录入</button>
        </div>
      </div>
    </header>
    <UploadDialog v-model="isOpen" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useThemeStore } from '../stores/theme';
import { useEffectsStore } from '../stores/effects';
import UploadDialog from './UploadDialog.vue';

const theme = useThemeStore();
const title = computed(() => (theme.mode === 'dark' ? '切换到浅色' : '切换到深色'));
const toggle = () => theme.toggleTheme();

const isOpen = ref(false);
const openForm = () => (isOpen.value = true);

const effects = useEffectsStore();
const animLabel = computed(() => (effects.animationsEnabled ? '关闭动画' : '开启动画'));
const toggleAnim = () => effects.toggleAnimations();
</script>

<style scoped>
</style>


