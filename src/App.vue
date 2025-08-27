<template>
  <div>
    <NavBar />
    <main class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <CoverHero :latest="latestItem" />
      <Timeline
        :items="items"
        :seasonalIndicator="settings.seasonalIndicator"
        :animationsEnabled="effects.animationsEnabled"
        :timeAxisPosition="settings.timeAxisPosition"
      />
    </main>
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
  import NavBar from './components/NavBar.vue';
  import CoverHero from './components/CoverHero.vue';
  import Timeline from './components/Timeline.vue';
  import BackToTop from './components/BackToTop.vue';
  import { useTimelineStore } from './stores/timeline';
  import { useEffectsStore } from './stores/effects';
  import { useSettingsStore } from './stores/settings';

  const timelineStore = useTimelineStore();
  const effects = useEffectsStore();
  const settings = useSettingsStore();
  const items = timelineStore.sortedItems;
  const latestItem = items[0] ?? null;
</script>

<style>
  /* 全局覆盖 V-Calendar 主题颜色，跟随当前主题 */
  :root {
    --site-main-color: #f59e0b;
    --site-main-color-30: rgba(245, 158, 11, 0.3);
    --vc-accent-50: var(--site-main-color);
    --vc-accent-100: var(--site-main-color);
    --vc-accent-200: var(--site-main-color);
    --vc-accent-300: var(--site-main-color);
    --vc-accent-400: var(--site-main-color);
    --vc-accent-500: var(--site-main-color);
    --vc-accent-600: var(--site-main-color);
    --vc-accent-700: var(--site-main-color);
    --vc-accent-800: var(--site-main-color);
    --vc-accent-900: var(--site-main-color);
  }

  .dark {
    --vc-accent-50: var(--site-main-color);
    --vc-accent-100: var(--site-main-color);
    --vc-accent-200: var(--site-main-color);
    --vc-accent-300: var(--site-main-color);
    --vc-accent-400: var(--site-main-color);
    --vc-accent-500: var(--site-main-color);
    --vc-accent-600: var(--site-main-color);
    --vc-accent-700: var(--site-main-color);
    --vc-accent-800: var(--site-main-color);
    --vc-accent-900: var(--site-main-color);
  }

  /* 适配文字与背景（可根据需要微调） */
  .vc-primary {
    color: var(--vc-accent-600);
  }
  .vc-bg-primary {
    background-color: var(--vc-accent-500);
  }
  .vc-text-primary {
    color: var(--vc-accent-600);
  }
</style>
