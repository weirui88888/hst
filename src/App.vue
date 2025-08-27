<template>
  <div>
    <NavBar 
      :seasonalIndicator="seasonalIndicator" 
      :timeAxisPosition="timeAxisPosition"
      @update:seasonalIndicator="seasonalIndicator = $event" 
      @update:timeAxisPosition="timeAxisPosition = $event"
    />
    <main class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <CoverHero :latest="latestItem" />
      <Timeline :items="items" :seasonalIndicator="seasonalIndicator" :animationsEnabled="effects.animationsEnabled" :timeAxisPosition="timeAxisPosition" />
    </main>
  </div>
  
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavBar from './components/NavBar.vue';
import CoverHero from './components/CoverHero.vue';
import Timeline from './components/Timeline.vue';
import { useTimelineStore } from './stores/timeline';
import { useEffectsStore } from './stores/effects';

const timelineStore = useTimelineStore();
const effects = useEffectsStore();
const items = timelineStore.sortedItems;
const latestItem = items[0] ?? null;
const seasonalIndicator = ref(false);
const timeAxisPosition = ref('right');
</script>

<style scoped>
</style>


