import { defineStore } from 'pinia';
import { timelineAPI, type TimelineItem } from '../utils/api';

function generateId() {
  return Math.random().toString(36).slice(2);
}

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  aspectRatio?: string;
}

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    items: [] as TimelineItem[],
    pinnedId: null as string | null,
    loading: false,
    error: null as string | null,
  }),
  
  getters: {
    timelineItems(state) {
      return state.items;
    },
    
    pinnedItem(state) {
      return state.pinnedId ? state.items.find(item => item.id === state.pinnedId) : null;
    },
  },
  
  actions: {
    // 加载时间轴数据
    async loadTimelineData() {
      this.loading = true;
      this.error = null;
      
      try {
        // 并行获取时间轴项目和置顶项目
        const [timelineResponse, pinnedResponse] = await Promise.all([
          timelineAPI.getItems(),
          timelineAPI.getPinned()
        ]);
        
        // 将API返回的items中的date字段转换为Date对象
        const itemsWithDateObjects = (timelineResponse.items || []).map(item => ({
          ...item,
          date: new Date(item.date)
        }));
        
        this.items = itemsWithDateObjects;
        this.pinnedId = pinnedResponse.pinnedId;

      } catch (error) {
        console.error('加载时间轴数据失败:', error);
        this.error = error instanceof Error ? error.message : '加载数据失败';
        
        // 如果API失败，使用本地演示数据作为后备
        this.loadDemoData();
      } finally {
        this.loading = false;
      }
    },
    
    // 加载演示数据（作为后备）
    loadDemoData() {
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

      // 创建演示数据
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
          date: d,
          media: [
            {
              type: 'image',
              url: `https://picsum.photos/seed/warm-${i}/960/540`,
              aspectRatio: randomRatio,
            },
          ],
        });
      }
      
      this.items = demo;
      this.pinnedId = null;
    },
    
    // 添加时间轴项目
    async addItem(item: Omit<TimelineItem, 'id'>) {
      try {
        const response = await timelineAPI.createItem(item);
        this.items.unshift(response.item);
        
        // 如果新项目被设置为置顶，更新置顶ID
        if (item.isPinned) {
          this.pinnedId = response.item.id;
        }
        
        return response.item;
      } catch (error) {
        console.error('添加时间轴项目失败:', error);
        throw error;
      }
    },
    
    // 更新时间轴项目
    async updateItem(id: string, updates: Partial<TimelineItem>) {
      try {
        const response = await timelineAPI.updateItem(id, updates);
        
        // 更新本地数据
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
          this.items[index] = response.item;
        }
        
        // 如果更新了置顶状态，更新置顶ID
        if (updates.isPinned !== undefined) {
          if (updates.isPinned) {
            this.pinnedId = id;
          } else if (this.pinnedId === id) {
            this.pinnedId = null;
          }
        }
        
        return response.item;
      } catch (error) {
        console.error('更新时间轴项目失败:', error);
        throw error;
      }
    },
    
    // 删除时间轴项目
    async deleteItem(id: string) {
      try {
        await timelineAPI.deleteItem(id);
        
        // 从本地数据中移除
        this.items = this.items.filter(item => item.id !== id);
        
        // 如果删除的是置顶项目，清除置顶ID
        if (this.pinnedId === id) {
          this.pinnedId = null;
        }
      } catch (error) {
        console.error('删除时间轴项目失败:', error);
        throw error;
      }
    },
    
    // 清除错误状态
    clearError() {
      this.error = null;
    },
  },
});
