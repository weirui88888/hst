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
    <Toast />
  </div>
</template>

<script setup lang="ts">
  import NavBar from './components/NavBar.vue';
  import CoverHero from './components/CoverHero.vue';
  import Timeline from './components/Timeline.vue';
  import BackToTop from './components/BackToTop.vue';
  import Toast from './components/Toast.vue';
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
  /* .vc-container .vc-weekday-1, .vc-container .vc-weekday-7  {
  color: red;
}

.vc-container .is-today{
  background-color: red;
} */

  /* .vc-container.vc-dark,.vc-container.vc-dark .vc-arrow{
  @apply bg-neutral-900;
 }
 .vc-container.vc-dark .vc-title{
  @apply bg-neutral-900;
 }
 .vc-nav-popover-container.vc-dark button{
  background: none;
  @apply text-white ;
 }
 .vc-nav-popover-container.vc-dark button:hover{
  @apply bg-[#334155] ;
 }

 .vc-nav-popover-container.vc-dark button:hover{
  @apply bg-[#334155] ;
 }
 .vc-nav-popover-container.vc-dark button.is-active{
  background-color: var(--site-main-color);
 } */
</style>
