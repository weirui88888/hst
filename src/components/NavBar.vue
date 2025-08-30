<template>
  <div>
    <header
      class="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800"
    >
      <div class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">
        <h1 class="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          {{ settings.siteTitle || UI_TEXTS.nav.defaultTitle }}
        </h1>
        <div class="flex items-center gap-3">
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors border-none"
            @click="toggle"
            :title="title"
          >
            <svg
              v-if="theme.mode === 'dark'"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              />
            </svg>
          </button>
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors border-none"
            @click="openForm"
            :title="UI_TEXTS.nav.add"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors border-none"
            @click="openSettings"
            :title="UI_TEXTS.nav.settings"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </button>
        </div>
      </div>
    </header>
    <UploadDialog v-model="isOpen" />
    <SettingsPanel
      v-model="settingsOpen"
      :seasonalIndicator="settings.seasonalIndicator"
      :animationsEnabled="effects.animationsEnabled"
      :timeAxisPosition="settings.timeAxisPosition"
      :siteTitle="settings.siteTitle"
      :siteEndText="settings.siteEndText"
      :musicAutoPlay="settings.musicAutoPlay"
      @update:seasonalIndicator="settings.setSeasonalIndicator"
      @update:animationsEnabled="updateAnimationsEnabled"
      @update:timeAxisPosition="settings.setTimeAxisPosition"
      @update:siteTitle="settings.setSiteTitle"
      @update:siteEndText="settings.setSiteEndText"
      @update:musicAutoPlay="settings.setMusicAutoPlay"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useThemeStore } from '../stores/theme';
  import { useEffectsStore } from '../stores/effects';
  import { useSettingsStore } from '../stores/settings';
  import UploadDialog from './UploadDialog.vue';
  import SettingsPanel from './SettingsPanel.vue';
  import { UI_TEXTS } from '../config/texts';

  const settings = useSettingsStore();

  const theme = useThemeStore();
  const title = computed(() => (theme.mode === 'dark' ? '切换到浅色' : '切换到深色'));
  const toggle = () => theme.toggleTheme();

  const isOpen = ref(false);
  const openForm = () => (isOpen.value = true);

  const effects = useEffectsStore();

  const settingsOpen = ref(false);
  const openSettings = () => {
    settingsOpen.value = !settingsOpen.value;
  };

  const updateAnimationsEnabled = (value: boolean) => {
    effects.setAnimationsEnabled(value);
  };
</script>

<style scoped></style>
