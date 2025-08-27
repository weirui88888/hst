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
        // 新增的故事标题
        '新年第一缕阳光',
        '春日的樱花雨',
        '夏日午后的蝉鸣',
        '秋叶飘落的瞬间',
        '冬雪覆盖的街道',
        '一月里的温暖时光',
        '五月花开的季节',
        '七月盛夏的记忆',
        '九月秋高气爽',
        '十二月岁末回望',
        '初雪纷飞的早晨',
        '花开满园的春天',
        '烈日当空的夏天',
        '金风送爽的秋天',
        '寒风凛冽的冬天',
        '新年愿望清单',
        '春日野餐时光',
        '夏日海边漫步',
        '秋日登山远眺',
        '冬日围炉夜话',
        '一月新开始',
        '五月青春飞扬',
        '七月热情似火',
        '九月收获季节',
        '十二月年终总结',
      ];

      // 创建不同长度的内容
      const contents = [
        '用一句话记录一段心情与光影。',
        '清晨的阳光透过窗帘洒在桌案上，一杯冒着热气的咖啡静静地等待着。这是属于我的宁静时刻，一切都那么美好而简单。',
        '今天和猫咪一起在阳台上晒太阳，它慵懒地躺在我的腿上，发出满足的呼噜声。这种简单的陪伴让我感到无比幸福。',
        '偶然翻出了老相册，那些泛黄的照片记录着过去的点点滴滴。每一张照片都承载着珍贵的回忆，让人不禁感慨时光飞逝。',
        '周末和朋友一起去了附近的小镇，那里有着不同于城市的宁静和美丽。古老的建筑、石板路、还有当地特色的小吃，一切都让人流连忘返。',
        '雨后漫步在城市的街道上，空气格外清新，一切都像被重新洗过一样干净。雨滴从树叶上滑落，发出清脆的声响。',
        '今天做了一顿家乡味道的饭菜，虽然简单，但每一口都充满了家的温暖。食物总是能唤起最深的记忆和情感。',
        '终于读完了那本一直想读的书，书中的故事和人物让我思考了很多。阅读总是能给人带来新的视角和感悟。',
        '黄昏时分在公园里散步，遇到了一个温柔的老人，他和我分享了他的人生故事。这些偶然的相遇总是让人感到温暖。',
        '夜晚的城市总是有着不同的魅力，街灯一盏盏亮起，为这个城市增添了温暖的光芒。',
        '在海边散步时捡到了一块心形的石头，虽然普通，但在我眼中却有着特殊的意义。',
        '给自己做了一张小卡片，上面写满了鼓励的话语。有时候我们需要给自己一些温暖和力量。',
        '尝试画了一幅小水彩画，虽然技法还很生疏，但创作的过程让我感到快乐和满足。',
        '窗外的云朵像棉花糖一样柔软，在蓝天的映衬下显得格外美丽。大自然总是能给人带来惊喜。',
        '有时候一个简单的拥抱比千言万语更有力量，它能传递最真挚的情感和温暖。',
        '生活中总是有很多微小的美好时刻，学会记住这些瞬间，让生活变得更加丰富和有意义。',
        '即使是在繁忙的城市中，也能找到一些温柔的角落，那里有着不同于喧嚣的宁静和美好。',
        '给未来的自己写了一封信，记录下现在的想法和期待。希望未来的自己能够实现这些美好的愿望。',
        '把喜欢的歌单循环播放，音乐总是能陪伴我们度过各种情绪的时刻。',
        '在平凡的生活中寻找那些闪光的瞬间，让每一天都变得有意义和美好。',
      ];

      // 创建包含指定月份的故事
      const specificMonths = [
        {
          month: 1,
          day: 15,
          title: '新年第一缕阳光',
          content:
            '一月的阳光透过窗帘洒在脸上，新的一年就这样开始了。窗外的世界还沉浸在冬日的宁静中，但心中已经充满了对未来的期待。每一个新的开始都值得被珍惜，就像这第一缕阳光一样温暖而珍贵。',
          tags: ['新年', '希望'],
        },
        {
          month: 1,
          day: 28,
          title: '一月里的温暖时光',
          content: '寒冷的冬天里，一杯热茶就能温暖整个下午。',
          tags: ['温暖', '冬日'],
        },
        {
          month: 1,
          day: 3,
          title: '一月新开始',
          content: '新的一年，新的开始，新的希望。',
          tags: ['新年', '开始'],
        },
        {
          month: 5,
          day: 12,
          title: '五月花开的季节',
          content:
            '五月的花都开了，空气中弥漫着淡淡的花香。樱花、桃花、梨花，各种花朵竞相绽放，将整个城市装扮得如诗如画。走在街上，仿佛置身于花的海洋中，心情也变得格外愉悦。春天总是能给人带来无限的美好和希望。',
          tags: ['春天', '花开'],
        },
        {
          month: 5,
          day: 20,
          title: '五月青春飞扬',
          content: '五月的风很温柔，就像青春一样美好。',
          tags: ['青春', '五月'],
        },
        {
          month: 5,
          day: 8,
          title: '春日野餐时光',
          content:
            '在五月的阳光下，和朋友一起野餐是最美好的时光。我们带着简单的食物，找了一片绿草地，铺上野餐垫，就这样度过了一个悠闲的下午。阳光透过树叶洒在身上，微风轻抚着脸颊，一切都那么美好。',
          tags: ['野餐', '朋友'],
        },
        {
          month: 7,
          day: 15,
          title: '七月盛夏的记忆',
          content: '七月的夏天很热，但回忆却很甜。',
          tags: ['夏天', '回忆'],
        },
        {
          month: 7,
          day: 22,
          title: '七月热情似火',
          content:
            '七月的热情就像太阳一样炙热。这个季节总是充满了活力和激情，人们穿着轻薄的衣物，在阳光下尽情享受生活。虽然天气炎热，但内心的热情比太阳更加炽热。',
          tags: ['热情', '夏天'],
        },
        {
          month: 7,
          day: 5,
          title: '夏日海边漫步',
          content: '七月的海边，海风轻抚，海浪轻拍。',
          tags: ['海边', '夏日'],
        },
        {
          month: 9,
          day: 10,
          title: '九月秋高气爽',
          content: '九月的天空很蓝，空气很清新。',
          tags: ['秋天', '清爽'],
        },
        {
          month: 9,
          day: 18,
          title: '九月收获季节',
          content:
            '九月的田野里，金黄的稻穗在风中摇曳。这是一个收获的季节，农民们忙碌着收割庄稼，空气中弥漫着稻谷的清香。看着金灿灿的稻田，心中充满了丰收的喜悦和对大自然的感恩。',
          tags: ['收获', '秋天'],
        },
        {
          month: 9,
          day: 25,
          title: '秋日登山远眺',
          content: '九月的山很美丽，登高望远，心旷神怡。',
          tags: ['登山', '秋天'],
        },
        {
          month: 12,
          day: 15,
          title: '十二月岁末回望',
          content: '十二月的夜晚，回顾这一年的点点滴滴。',
          tags: ['回顾', '年终'],
        },
        {
          month: 12,
          day: 24,
          title: '十二月年终总结',
          content: '一年的时光就这样过去了，感谢所有的遇见。',
          tags: ['年终', '感恩'],
        },
        {
          month: 12,
          day: 31,
          title: '冬日围炉夜话',
          content:
            '十二月的最后一天，和家人围炉而坐，温暖如春。窗外寒风呼啸，但屋内却充满了温暖和爱意。我们分享着这一年的故事，回忆着美好的时光，期待着新的一年的到来。这种温馨的时刻总是让人感到幸福和满足。',
          tags: ['家庭', '温暖'],
        },
      ];

      // 添加指定月份的故事
      specificMonths.forEach((item, index) => {
        const d = new Date(baseDate.getFullYear(), item.month - 1, item.day);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const randomRatio = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];

        demo.push({
          id: generateId(),
          title: item.title,
          content: item.content,
          tags: item.tags,
          date: `${yyyy}-${mm}-${dd}`,
          media: [
            {
              type: 'image',
              url: `https://picsum.photos/seed/monthly-${item.month}-${index}/960/540`,
              aspectRatio: randomRatio,
            },
          ],
        });
      });

      // 添加原有的随机故事
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
          content: contents[i] ?? '用一句话记录一段心情与光影。',
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
