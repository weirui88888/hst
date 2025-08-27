<template>
  <div>
    <NavBar />
    <main class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <CoverHero :latest="latestItem" />
      <Timeline :items="items" />
    </main>
  </div>
  
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import CoverHero from './components/CoverHero.vue';
import Timeline from './components/Timeline.vue';
import { useTimelineStore } from './stores/timeline';

const timelineStore = useTimelineStore();
const items = timelineStore.sortedItems;
const latestItem = items[0] ?? null;
</script>

<style scoped>
</style>


