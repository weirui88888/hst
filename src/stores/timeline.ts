import { defineStore } from 'pinia';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  aspectRatio?: string; // 新增：图片比例
}

export interface TimelineItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  date: string; // ISO yyyy-mm-dd
  media?: MediaItem[];
}

function generateId() {
  return Math.random().toString(36).slice(2);
}

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    items: ((): TimelineItem[] => {
          const baseDate = new Date();
    const demo: TimelineItem[] = [];
    const aspectRatios = ['16/9', '4/3', '1/1', '3/2', '2/1', '5/4', '3/4', '2/3'];
    const titles = [
        '清晨的咖啡香',
        '和猫在阳台晒太阳',
        '把老相册翻了出来',
        '周末短途旅行',
        '一次即兴的街拍',
        '雨后的城市像被洗过',
        '做了一顿家乡味道',
        '读完一本久违的书',
        '黄昏散步遇见温柔的风',
        '夜色里的一盏灯',
        '海边捡到一块心形石头',
        '给自己做了张小卡片',
        '尝试画一幅小水彩',
        '窗外的云像棉花糖',
        '拥抱比语言更有温度',
        '记住当下的微小欢喜',
        '城市也会有温柔角落',
        '给未来写一封信',
        '把喜欢的歌单循环',
        '在平凡里找到闪光',
      ];
      for (let i = 0; i < 20; i += 1) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const randomRatio = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
        demo.push({
          id: generateId(),
          title: titles[i] ?? `第 ${i + 1} 个小故事`,
          content: '用一句话记录一段心情与光影。',
          tags: i % 3 === 0 ? ['生活'] : i % 3 === 1 ? ['旅行'] : ['日常'],
          date: `${yyyy}-${mm}-${dd}`,
          media: [
            {
              type: 'image',
              url: `https://picsum.photos/seed/warm-${i}/960/540`,
              aspectRatio: randomRatio,
            },
          ],
        });
      }
      return demo;
    })(),
  }),
  getters: {
    sortedItems(state) {
      return [...state.items].sort((a, b) => (a.date < b.date ? 1 : -1));
    },
  },
  actions: {
    addItem(item: Omit<TimelineItem, 'id'>) {
      this.items.unshift({ id: generateId(), ...item });
    },
  },
});


