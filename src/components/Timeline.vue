<template>
  <section class="relative py-8">
    <div class="space-y-16">
      <article
        v-for="(item, index) in items"
        :key="item.id"
        :ref="(el) => setSectionRef(el, index)"
        class="relative transition-all duration-500 will-change-transform"
        :class="articleClass(index)"
      >
        <!-- 连接线 -->
        <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-neutral-300 dark:via-neutral-600 to-transparent -translate-x-1/2"></div>
        
        <!-- 时间点 -->
        <div class="absolute left-1/2 top-1/2 w-4 h-4 bg-neutral-600 rounded-full border-4 border-neutral-900 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-500" :class="timePointClass(index)"></div>
        
                <!-- 故事内容 -->
        <div class="relative max-w-4xl mx-auto transition-all duration-700 ease-out" :class="storyClass(index)">
          <div class="grid md:grid-cols-2 gap-8 items-center">
            <!-- 图片区域 -->
            <div class="relative" v-gsap="{ direction: index % 2 === 0 ? 'right' : 'left', skew: 4, rotate: 1, distance: 80, ease: 'power3.out', duration: 0.9 }">
              <div :style="imageFrameStyle(item)" class="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <MediaPreview :media="item.media" />
              </div>
            </div>
            
            <!-- 文字区域 -->
            <div class="space-y-4" v-gsap="{ direction: index % 2 === 0 ? 'left' : 'right', distance: 60, ease: 'power2.out', scale: 0.98, stagger: 0.08 }">
              <div>
                <h3 class="text-xl md:text-2xl font-semibold mb-2 tracking-tight text-neutral-200">{{ item.title }}</h3>
                <p class="text-neutral-300 leading-relaxed">{{ item.content }}</p>
              </div>
              
              <div class="flex flex-wrap gap-2 items-center">
                <span class="px-3 py-1 rounded-full bg-neutral-700 text-neutral-300 text-sm font-medium" v-for="tag in item.tags" :key="tag">#{{ tag }}</span>
                <span class="ml-auto text-sm text-neutral-400 font-medium">{{ item.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script lang="ts">
import MediaPreview from './MediaPreview.vue';

export default {
  name: 'Timeline',
  components: { MediaPreview },
  props: {
    items: { type: Array, default: () => [] },
  },
  data() {
    return {
      activeIndex: -1 as number,
      sectionRefs: [] as HTMLElement[],
      rafId: 0 as number,
    };
  },
  methods: {

    setSectionRef(el: Element | null, idx: number) {
      if (el) this.sectionRefs[idx] = el as HTMLElement;
    },
    updateActive() {
      const viewportCenter = window.innerHeight / 2;
      let best = -1;
      let bestDist = Number.POSITIVE_INFINITY;
      
      for (let i = 0; i < this.sectionRefs.length; i += 1) {
        const el = this.sectionRefs[i];
        if (!el) continue;
        
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - viewportCenter);
        
        // 只有当元素在视窗内时才考虑
        if (rect.bottom > 0 && rect.top < window.innerHeight && dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      
      // 只有当找到合适的元素且与当前不同时才更新
      if (best !== -1 && best !== this.activeIndex) {
        this.activeIndex = best;
      }
    },
    onScroll() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = requestAnimationFrame(this.updateActive);
    },
    articleClass(index: number) {
      return index === this.activeIndex ? 'opacity-100' : 'opacity-60';
    },
    storyClass(index: number) {
      if (index === this.activeIndex) {
        return 'scale-[1.02] md:scale-[1.05] -translate-y-4 md:-translate-y-6';
      }
      return 'scale-100 translate-y-0';
    },
    timePointClass(index: number) {
      if (index === this.activeIndex) {
        return 'w-6 h-6 bg-neutral-400 shadow-lg shadow-neutral-400/30 scale-125';
      }
      return 'w-4 h-4';
    },
    imageFrameStyle(item: any) {
      const media = item.media?.[0];
      if (!media?.aspectRatio) return { aspectRatio: '16/9' };
      
      // 解析比例字符串 (如 "16/9", "4/3", "1/1")
      const [width, height] = media.aspectRatio.split('/').map(Number);
      if (width && height) {
        return { aspectRatio: `${width}/${height}` };
      }
      return { aspectRatio: '16/9' };
    },
  },
  mounted() {
    this.updateActive();
    window.addEventListener('scroll', this.onScroll as any, { passive: true } as any);
    window.addEventListener('resize', this.onScroll as any, { passive: true } as any);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll as any);
    window.removeEventListener('resize', this.onScroll as any);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  },
};
</script>

<style scoped>
</style>


