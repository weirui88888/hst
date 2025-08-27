<template>
  <section class="relative py-8">
    <!-- 时间轴线 -->
    <div
      class="fixed top-1/2 -translate-y-1/2 z-50 hidden lg:block transition-all duration-300"
      :class="timeAxisPosition === 'left' ? 'left-8' : 'right-8'"
    >
      <div class="relative timeline-axis">
        <!-- 时间轴竖线 -->
        <div
          class="w-0.5 h-64 timeline-axis-line mx-auto cursor-pointer"
          @click="handleTimelineClick"
        ></div>

        <!-- 当前时间点 -->
        <div
          class="absolute left-1/2 w-3 h-3 bg-neutral-600 dark:bg-neutral-400 rounded-full border-2 border-neutral-900 dark:border-neutral-100 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 timeline-axis-point cursor-pointer hover:scale-110 hover:bg-neutral-500 dark:hover:bg-neutral-300"
          :class="{ 'duration-0': isDragging || isAutoScrolling }"
          :style="timeAxisPositionStyle"
          @mousedown="startDrag"
          @touchstart="startDrag"
        ></div>

        <!-- 当前时间显示 -->
        <div
          class="absolute top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 text-sm font-medium whitespace-nowrap transition-all duration-200 timeline-time"
          :class="[
            timeAxisPosition === 'left' ? 'left-6 text-right' : 'right-6 text-left',
            isDragging || isAutoScrolling ? 'duration-0' : '',
          ]"
          :style="[timeAxisPositionStyle, timeAxisLabelStyle]"
        >
          {{ currentTimeDisplay }}
        </div>
      </div>
    </div>

    <div class="space-y-16">
      <article
        v-for="(item, index) in items"
        :key="`${item.id}-${animationsEnabled}`"
        :ref="(el) => setSectionRef(el, index)"
        class="relative will-change-transform"
        :class="[animationsEnabled ? 'transition-all duration-500' : '', articleClass(index)]"
      >
        <!-- 故事内容 -->
        <div
          class="relative max-w-4xl mx-auto"
          :class="[
            animationsEnabled ? 'transition-all duration-700 ease-out' : '',
            storyClass(index),
          ]"
        >
          <div class="grid md:grid-cols-2 gap-12 items-center" :class="layoutClass(index)">
            <!-- 图片区域 -->
            <div
              class="relative"
              :class="imageOrderClass(index)"
              v-gsap="imageAnimationProps(index)"
            >
              <div class="w-full rounded-2xl overflow-visible p-8">
                <div
                  :style="imageFrameStyle(item)"
                  class="timeline-image w-full rounded-xl overflow-hidden"
                  :class="[
                    animationsEnabled
                      ? 'transition-all duration-300 hover:scale-[1.02] animations-enabled'
                      : '',
                  ]"
                >
                  <MediaPreview :media="item.media" />
                </div>
              </div>
            </div>

            <!-- 文字区域 -->
            <div
              class="space-y-4"
              :class="textOrderClass(index)"
              v-gsap="textAnimationProps(index)"
            >
              <div>
                <h3
                  class="text-xl md:text-2xl font-semibold mb-2 tracking-tight text-neutral-800 dark:text-neutral-200"
                >
                  {{ item.title }}
                </h3>
                <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {{ item.content }}
                </p>
              </div>

              <div class="flex flex-wrap gap-2 items-center">
                <span
                  class="px-3 py-1 rounded-md bg-neutral-700 text-neutral-300 text-xs font-medium"
                  v-for="tag in item.tags"
                  :key="tag"
                  >#{{ tag }}</span
                >
                <span class="ml-auto text-sm text-neutral-500 dark:text-neutral-400 font-medium">{{
                  item.date
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
      <!-- 时间轴结尾标记 -->
      <div class="mt-20 flex flex-col items-center select-none">
        <div class="h-px w-24 bg-neutral-300/50 dark:bg-neutral-700/60"></div>
        <div class="mt-3 text-sm tracking-wide text-neutral-400 dark:text-neutral-500">
          — 已到时间轴结尾 —
        </div>
      </div>
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
      seasonalIndicator: { type: Boolean, default: false },
      animationsEnabled: { type: Boolean, default: true },
      timeAxisPosition: { type: String, default: 'right' }, // 'left' 或 'right'
    },
    data() {
      return {
        activeIndex: -1 as number,
        sectionRefs: [] as HTMLElement[],
        rafId: 0 as number,
        isDragging: false as boolean,
        dragStartY: 0 as number,
        timelineAxisTop: 0 as number,
        timelineAxisHeight: 0 as number,
        // 平滑滚动状态，用于抑制updateActive抖动
        isAutoScrolling: false as boolean,
        autoScrollTimer: 0 as any,
        // 时间轴两端留白比例（0-0.49），用于避免滑块顶到两端
        axisEndPaddingRatio: 0.1 as number,
        // 时间轴两端像素留白，用于保证上下端绝对对称
        axisPaddingPx: 16 as number,
      };
    },
    computed: {
      timeAxisPositionStyle() {
        if (this.activeIndex === -1 || this.items.length === 0) {
          return { top: '50%' };
        }

        // 计算时间点在轴线上的位置（加入两端留白，且基于实际轴高）
        const baseProgress = this.activeIndex / (this.items.length - 1); // 0-1
        const ratioPad = Math.max(0, Math.min(0.49, this.axisEndPaddingRatio));
        const mappedProgress = ratioPad + baseProgress * (1 - 2 * ratioPad); // [pad,1-pad]

        const { minY, range } = this.getAxisMetrics();
        const topPosition = minY + mappedProgress * range;

        return { top: `${topPosition}px` };
      },

      // 固定时间标签宽度并使用等宽数字，避免内容变化引起的抖动
      timeAxisLabelStyle() {
        return {
          width: '120px',
          display: 'inline-block',
          fontVariantNumeric: 'tabular-nums',
        } as Partial<CSSStyleDeclaration>;
      },

      currentTimeDisplay() {
        if (this.activeIndex === -1 || this.items.length === 0) {
          return '';
        }

        const currentItem = this.items[this.activeIndex];
        const date = currentItem?.date || '';

        if (this.seasonalIndicator && date) {
          const month = this.getMonthFromDate(date);
          const season = this.getSeasonFromMonth(month);
          return `${season} ${date}`;
        }

        return date;
      },
    },
    methods: {
      setSectionRef(el: Element | null, idx: number) {
        if (el) this.sectionRefs[idx] = el as HTMLElement;
      },

      startDrag(event: MouseEvent | TouchEvent) {
        event.preventDefault();
        this.isDragging = true;

        // 获取时间轴的位置信息
        const timelineAxis = document.querySelector('.timeline-axis') as HTMLElement;
        if (timelineAxis) {
          const rect = timelineAxis.getBoundingClientRect();
          this.timelineAxisTop = rect.top;
          this.timelineAxisHeight = rect.height;
        }

        // 记录起始位置
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        this.dragStartY = clientY;

        // 添加事件监听器
        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('touchmove', this.onDrag, { passive: false });
        document.addEventListener('mouseup', this.stopDrag);
        document.addEventListener('touchend', this.stopDrag);

        // 防止文本选择
        document.body.style.userSelect = 'none';
      },

      onDrag(event: MouseEvent | TouchEvent) {
        if (!this.isDragging) return;

        event.preventDefault();
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

        // 计算在时间轴上的相对位置
        const relativeY = clientY - this.timelineAxisTop;

        // 计算圆点的实际活动范围（与timeAxisPositionStyle保持一致）
        const { minY, maxY, range } = this.getAxisMetrics();

        // 将拖拽位置映射到圆点的活动范围
        const relativeDragY = Math.max(minY, Math.min(maxY, relativeY));
        const rawProgress = range > 0 ? (relativeDragY - minY) / range : 0; // 区间 [pad, 1-pad]

        // 去掉两端留白得到基础进度
        const ratioPad = Math.max(0, Math.min(0.49, this.axisEndPaddingRatio));
        const baseProgress = Math.max(
          0,
          Math.min(1, (rawProgress - ratioPad) / (1 - 2 * ratioPad)),
        );

        // 根据基础进度计算对应的故事索引
        const newIndex = Math.round(baseProgress * (this.items.length - 1));

        // 更新活动索引
        if (newIndex !== this.activeIndex && newIndex >= 0 && newIndex < this.items.length) {
          this.activeIndex = newIndex;
        }
      },

      stopDrag() {
        this.isDragging = false;

        // 移除事件监听器
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('touchmove', this.onDrag);
        document.removeEventListener('mouseup', this.stopDrag);
        document.removeEventListener('touchend', this.stopDrag);

        // 松手后一次性滚动到对应位置，避免徘徊
        if (this.activeIndex >= 0) {
          this.scrollToStory(this.activeIndex);
        }

        // 恢复文本选择
        document.body.style.userSelect = '';
      },

      scrollToStory(index: number) {
        const targetElement = this.sectionRefs[index];
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          const viewportCenter = window.innerHeight / 2;
          const targetCenter = rect.top + rect.height / 2;
          const scrollOffset = targetCenter - viewportCenter;

          // 程序化滚动（瞬时），避免视觉徘徊
          this.isAutoScrolling = true;
          if (this.autoScrollTimer) window.clearTimeout(this.autoScrollTimer);
          this.autoScrollTimer = window.setTimeout(() => {
            this.isAutoScrolling = false;
          }, 120);

          window.scrollBy({
            top: scrollOffset,
            behavior: 'auto',
          });
        }
      },

      handleTimelineClick(event: MouseEvent) {
        // 如果正在拖拽，不处理点击
        if (this.isDragging) return;

        // 获取时间轴的位置信息
        const timelineAxis = document.querySelector('.timeline-axis') as HTMLElement;
        if (!timelineAxis) return;

        const rect = timelineAxis.getBoundingClientRect();
        const clickY = event.clientY - rect.top;

        // 计算圆点的实际活动范围（与timeAxisPositionStyle保持一致）
        const { minY, maxY, range } = this.getAxisMetrics();

        // 将点击位置映射到圆点的活动范围
        const relativeClickY = Math.max(minY, Math.min(maxY, clickY));
        const rawProgress = range > 0 ? (relativeClickY - minY) / range : 0; // 区间 [pad, 1-pad]

        // 去掉两端留白为基础进度
        const ratioPad = Math.max(0, Math.min(0.49, this.axisEndPaddingRatio));
        const baseProgress = Math.max(
          0,
          Math.min(1, (rawProgress - ratioPad) / (1 - 2 * ratioPad)),
        );

        // 根据基础进度计算对应的故事索引
        const newIndex = Math.round(baseProgress * (this.items.length - 1));

        // 确保索引在有效范围内，并且允许点击到相同位置
        if (newIndex >= 0 && newIndex < this.items.length) {
          this.activeIndex = newIndex;

          // 立即滚动到对应的故事位置
          this.scrollToStory(newIndex);
        }
      },
      // 基于实际轴高返回上下端留白后的可用区间
      getAxisMetrics() {
        const axisEl = document.querySelector('.timeline-axis') as HTMLElement | null;
        const lineEl = document.querySelector('.timeline-axis-line') as HTMLElement | null;
        if (!axisEl || !lineEl) {
          // 回退到固定值
          const fallbackHeight = 256;
          const pxPad = Math.max(0, Math.min(fallbackHeight / 2 - 1, this.axisPaddingPx));
          const ratioPad = Math.max(0, Math.min(0.49, this.axisEndPaddingRatio));
          const ratioPadPx = fallbackHeight * ratioPad;
          const padPx = Math.max(pxPad, ratioPadPx);
          const minY = padPx;
          const maxY = fallbackHeight - padPx;
          const range = Math.max(0, maxY - minY);
          return { minY, maxY, range };
        }

        const axisRect = axisEl.getBoundingClientRect();
        const lineRect = lineEl.getBoundingClientRect();
        // 线在轴容器内的相对位置
        const lineTop = lineRect.top - axisRect.top;
        const lineBottom = lineRect.bottom - axisRect.top;
        const lineHeight = Math.max(0, lineBottom - lineTop);

        // 像素/比例留白，取较大者，确保上下端一致
        const pxPad = Math.max(0, Math.min(lineHeight / 2 - 1, this.axisPaddingPx));
        const ratioPad = Math.max(0, Math.min(0.49, this.axisEndPaddingRatio));
        const ratioPadPx = lineHeight * ratioPad;
        const padPx = Math.max(pxPad, ratioPadPx);

        const minY = lineTop + padPx;
        const maxY = lineBottom - padPx;
        const range = Math.max(0, maxY - minY);
        // 更新缓存的top/height以便拖拽使用
        this.timelineAxisTop = axisRect.top;
        this.timelineAxisHeight = axisRect.height;
        return { minY, maxY, range };
      },
      updateActive() {
        // 如果正在拖拽，不更新活动索引
        if (this.isDragging || this.isAutoScrolling) return;

        // 边界吸附：顶部/底部时强制首尾对齐
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop;
        const viewportH = window.innerHeight;
        const scrollHeight = Math.max(
          doc.scrollHeight,
          document.body ? document.body.scrollHeight : 0,
          doc.offsetHeight,
          doc.clientHeight,
        );
        const bottomGap = scrollHeight - (scrollTop + viewportH);
        const edgeThreshold = 24; // px

        if (scrollTop <= edgeThreshold && this.activeIndex !== 0) {
          this.activeIndex = 0;
          return;
        }
        if (bottomGap <= edgeThreshold && this.activeIndex !== this.items.length - 1) {
          this.activeIndex = this.items.length - 1;
          return;
        }

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
        // 时间轴需要始终更新，但故事动画只在开启时处理
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(() => {
          this.updateActive();
        });
      },
      articleClass(index: number) {
        if (!this.animationsEnabled) {
          return 'opacity-100'; // 动画关闭时，所有文章都保持完全不透明
        }
        return index === this.activeIndex ? 'opacity-100' : 'opacity-60';
      },
      storyClass(index: number) {
        if (!this.animationsEnabled) {
          return 'scale-100 translate-y-0'; // 动画关闭时，所有故事都保持原始大小和位置
        }
        if (index === this.activeIndex) {
          return 'scale-[1.02] md:scale-[1.05] -translate-y-4 md:-translate-y-6';
        }
        return 'scale-100 translate-y-0';
      },
      layoutClass(index: number) {
        // 随机决定图片在左还是右
        const imagePositions = [
          true,
          false,
          true,
          false,
          true,
          true,
          false,
          false,
          true,
          false,
          true,
          false,
          true,
          true,
          false,
          true,
          false,
          false,
          true,
          false,
        ];
        const imageOnLeft = imagePositions[index % imagePositions.length];
        return imageOnLeft ? '' : 'md:grid-flow-col-dense';
      },
      imageOrderClass(index: number) {
        const imagePositions = [
          true,
          false,
          true,
          false,
          true,
          true,
          false,
          false,
          true,
          false,
          true,
          false,
          true,
          true,
          false,
          true,
          false,
          false,
          true,
          false,
        ];
        const imageOnLeft = imagePositions[index % imagePositions.length];
        return imageOnLeft ? 'order-1' : 'order-2';
      },
      textOrderClass(index: number) {
        const imagePositions = [
          true,
          false,
          true,
          false,
          true,
          true,
          false,
          false,
          true,
          false,
          true,
          false,
          true,
          true,
          false,
          true,
          false,
          false,
          true,
          false,
        ];
        const imageOnLeft = imagePositions[index % imagePositions.length];
        return imageOnLeft ? 'order-2' : 'order-1';
      },
      imageAnimationProps(index: number) {
        const imagePositions = [
          true,
          false,
          true,
          false,
          true,
          true,
          false,
          false,
          true,
          false,
          true,
          false,
          true,
          true,
          false,
          true,
          false,
          false,
          true,
          false,
        ];
        const imageOnLeft = imagePositions[index % imagePositions.length];
        return {
          direction: imageOnLeft ? 'right' : 'left',
          skew: 4,
          rotate: 1,
          distance: 80,
          ease: 'power3.out',
          duration: 0.9,
        };
      },
      textAnimationProps(index: number) {
        const imagePositions = [
          true,
          false,
          true,
          false,
          true,
          true,
          false,
          false,
          true,
          false,
          true,
          false,
          true,
          true,
          false,
          true,
          false,
          false,
          true,
          false,
        ];
        const imageOnLeft = imagePositions[index % imagePositions.length];
        return {
          direction: imageOnLeft ? 'left' : 'right',
          distance: 60,
          ease: 'power2.out',
          scale: 0.98,
          stagger: 0.08,
        };
      },

      imageFrameStyle(item: any) {
        const media = item.media?.[0];
        let aspectRatio = '16/9';

        if (media?.aspectRatio) {
          // 解析比例字符串 (如 "16/9", "4/3", "1/1")
          const [width, height] = media.aspectRatio.split('/').map(Number);
          if (width && height) {
            aspectRatio = `${width}/${height}`;
          }
        } else {
          // 如果没有指定比例，则随机生成一个比例
          aspectRatio = this.getRandomAspectRatio(item.id);
        }

        // 为每个图片生成随机的倾斜角度和阴影偏移
        const rotation = this.getRandomRotation(item.id);
        const shadowOffset = this.getRandomShadowOffset(item.id);

        return {
          aspectRatio,
          transform: `rotate(${rotation}deg)`,
          boxShadow: `${shadowOffset.x}px ${shadowOffset.y}px 20px rgba(0, 0, 0, 0.3)`,
          transition: 'all 0.3s ease-out',
        };
      },

      getRandomRotation(itemId: string) {
        // 使用itemId作为种子来生成一致的随机角度
        let hash = 0;
        for (let i = 0; i < itemId.length; i++) {
          const char = itemId.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash; // 转换为32位整数
        }

        // 生成-8到8度之间的随机角度，但大部分图片保持接近0度
        const randomValue = Math.abs(hash) % 100;

        // 65%的概率保持接近0度（-1到1度）
        if (randomValue < 65) {
          return ((hash % 21) - 10) / 10; // -1到1度
        }
        // 25%的概率轻微倾斜（-3到3度）
        else if (randomValue < 90) {
          return ((hash % 61) - 30) / 10; // -3到3度
        }
        // 8%的概率中等倾斜（-5到5度）
        else if (randomValue < 98) {
          return ((hash % 101) - 50) / 10; // -5到5度
        }
        // 2%的概率较大倾斜（-8到8度）
        else {
          return ((hash % 161) - 80) / 10; // -8到8度
        }
      },

      getRandomAspectRatio(itemId: string) {
        // 使用itemId + "aspect"作为种子来生成随机比例
        const seed = itemId + 'aspect';
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
          const char = seed.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash;
        }

        // 生成0-100的随机值
        const randomValue = Math.abs(hash) % 100;

        // 根据概率分布选择比例
        if (randomValue < 35) {
          // 35%概率：16/9 宽屏（最常见的现代比例）
          return '16/9';
        } else if (randomValue < 55) {
          // 20%概率：4/3 标准比例
          return '4/3';
        } else if (randomValue < 70) {
          // 15%概率：1/1 正方形
          return '1/1';
        } else if (randomValue < 80) {
          // 10%概率：3/2 经典比例
          return '3/2';
        } else if (randomValue < 88) {
          // 8%概率：5/4 经典比例
          return '5/4';
        } else if (randomValue < 94) {
          // 6%概率：3/4 竖屏
          return '3/4';
        } else if (randomValue < 98) {
          // 4%概率：21/9 超宽屏
          return '21/9';
        } else {
          // 2%概率：2/3 竖屏
          return '2/3';
        }
      },

      getRandomShadowOffset(itemId: string) {
        // 使用itemId + "shadow"作为种子来生成阴影偏移
        const seed = itemId + 'shadow';
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
          const char = seed.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash;
        }

        // 生成-12到12像素的随机偏移，但大部分保持较小偏移
        const randomValue = Math.abs(hash) % 100;

        let x, y;
        if (randomValue < 70) {
          // 70%概率：小偏移（-4到4像素）
          x = ((hash % 81) - 40) / 10;
          y = (((hash * 31) % 81) - 40) / 10;
        } else if (randomValue < 90) {
          // 20%概率：中等偏移（-8到8像素）
          x = ((hash % 161) - 80) / 10;
          y = (((hash * 31) % 161) - 80) / 10;
        } else {
          // 10%概率：较大偏移（-12到12像素）
          x = ((hash % 241) - 120) / 10;
          y = (((hash * 31) % 241) - 120) / 10;
        }

        return { x, y };
      },

      getMonthFromDate(dateString: string) {
        // 尝试从日期字符串中提取月份
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return date.getMonth() + 1; // 返回1-12的月份
        }

        // 如果无法解析，尝试从字符串中匹配月份
        const monthMatch = dateString.match(/(\d{1,2})[-/](\d{1,2})/);
        if (monthMatch) {
          return parseInt(monthMatch[2]); // 假设格式为 MM/DD 或 MM-DD
        }

        // 尝试匹配ISO格式 yyyy-mm-dd
        const isoMatch = dateString.match(/(\d{4})-(\d{1,2})/);
        if (isoMatch) {
          return parseInt(isoMatch[2]); // 返回月份
        }

        return 1; // 默认返回1月
      },

      getSeasonFromMonth(month: number) {
        if (month >= 3 && month <= 5) {
          return '🌱春';
        } else if (month >= 6 && month <= 8) {
          return '🌞夏';
        } else if (month >= 9 && month <= 11) {
          return '🍂秋';
        } else {
          return '❄️冬';
        }
      },
    },
    mounted() {
      // 时间轴需要始终工作，所以滚动监听器要始终添加
      this.updateActive();
      window.addEventListener('scroll', this.onScroll as any, { passive: true } as any);
      window.addEventListener(
        'resize',
        () => {
          // 尺寸变更时更新轴尺寸并刷新定位
          const axisEl = document.querySelector('.timeline-axis') as HTMLElement | null;
          if (axisEl) {
            const rect = axisEl.getBoundingClientRect();
            this.timelineAxisTop = rect.top;
            this.timelineAxisHeight = rect.height;
          }
          this.onScroll();
        },
        { passive: true } as any,
      );
    },
    beforeUnmount() {
      window.removeEventListener('scroll', this.onScroll as any);
      window.removeEventListener('resize', this.onScroll as any);
      if (this.rafId) cancelAnimationFrame(this.rafId);

      // 清理拖拽事件监听器
      this.stopDrag();
    },
  };
</script>

<style scoped>
  /* 图片倾斜效果增强 */
  .timeline-image {
    transform-origin: center center;
    backface-visibility: hidden;
  }

  /* 悬停时的动画效果 - 只在动画开启时生效 */
  .timeline-image.animations-enabled:hover {
    transform: scale(1.03) rotate(var(--rotation, 0deg)) !important;
    box-shadow: var(--shadow-x, 0px) var(--shadow-y, 0px) 15px rgba(0, 0, 0, 0.3) !important;
    z-index: 10;
  }

  /* 确保图片在倾斜时不会超出容器 */
  .overflow-visible {
    overflow: visible !important;
  }

  /* 添加一些微妙的背景装饰 - 只在动画开启时生效 */
  .timeline-image::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .timeline-image.animations-enabled:hover::before {
    opacity: 1;
  }

  /* 时间轴线样式 */
  .timeline-axis {
    border-radius: 20px;
    padding: 20px 10px;
  }

  /* 时间标签固定宽度并使用等宽数字，防抖动 */
  .timeline-time {
    width: 120px;
    font-variant-numeric: tabular-nums;
  }

  .timeline-axis-line {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(156, 163, 175, 0.3) 20%,
      rgba(156, 163, 175, 0.6) 50%,
      rgba(156, 163, 175, 0.3) 80%,
      transparent 100%
    );
  }

  .timeline-axis-point {
    box-shadow: 0 0 10px rgba(156, 163, 175, 0.4);
  }
</style>
