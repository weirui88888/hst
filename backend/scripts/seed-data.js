import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserConfig from '../src/models/UserConfig.js';
import TimelineItem from '../src/models/TimelineItem.js';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hst-app';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB 连接成功');
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error.message);
    process.exit(1);
  }
};

const seedUserConfig = async () => {
  try {
    // 清空现有配置
    await UserConfig.deleteMany({});
    
    // 创建默认配置
    const config = new UserConfig({
      siteTitle: '我的故事',
      siteEndText: '— 已到时间轴结尾 —',
      timeAxisPosition: 'right',
      seasonalIndicator: false,
      animationsEnabled: true
    });
    
    await config.save();
    console.log('✅ 用户配置初始化成功');
  } catch (error) {
    console.error('❌ 用户配置初始化失败:', error);
  }
};

const seedTimelineItems = async () => {
  try {
    // 清空现有数据
    await TimelineItem.deleteMany({});
    
    // 创建示例时间轴项目
    const sampleItems = [
      {
        title: '项目启动',
        content: '今天开始了一个新的项目，这是一个关于个人故事的时间轴应用。希望能够记录下生活中的每一个重要时刻。',
        tags: ['项目', '开始'],
        date: '2024-01-15',
        media: [
          {
            type: 'image',
            url: '/images/project-start.jpg',
            aspectRatio: '16/9'
          }
        ],
        isPinned: true
      },
      {
        title: '技术选型',
        content: '决定使用Vue3 + TypeScript + Express + MongoDB的技术栈。前端使用Vite构建，后端使用Express提供API服务。',
        tags: ['技术', 'Vue3', 'Express'],
        date: '2024-01-20',
        media: []
      },
      {
        title: 'UI设计完成',
        content: '完成了时间轴界面的设计，包括响应式布局、暗色主题支持、动画效果等。用户体验得到了很好的优化。',
        tags: ['设计', 'UI', '用户体验'],
        date: '2024-01-25',
        media: [
          {
            type: 'image',
            url: '/images/ui-design.jpg',
            aspectRatio: '4/3'
          }
        ]
      },
      {
        title: '后端API开发',
        content: '完成了三个核心API接口的开发：用户配置接口、时间轴数据接口、置顶项目接口。数据模型设计合理，支持完整的CRUD操作。',
        tags: ['后端', 'API', 'MongoDB'],
        date: '2024-01-30',
        media: []
      },
      {
        title: 'Monorepo重构',
        content: '将项目重构为pnpm monorepo结构，前端和后端分别作为独立的workspace。这样便于管理依赖和部署。',
        tags: ['架构', 'Monorepo', 'pnpm'],
        date: '2024-02-01',
        media: [
          {
            type: 'image',
            url: '/images/monorepo.jpg',
            aspectRatio: '16/9'
          }
        ]
      }
    ];
    
    for (const itemData of sampleItems) {
      const item = new TimelineItem(itemData);
      await item.save();
    }
    
    console.log('✅ 时间轴数据初始化成功');
  } catch (error) {
    console.error('❌ 时间轴数据初始化失败:', error);
  }
};

const main = async () => {
  console.log('🚀 开始初始化数据...');
  
  await connectDB();
  await seedUserConfig();
  await seedTimelineItems();
  
  console.log('✅ 所有数据初始化完成');
  process.exit(0);
};

main().catch(console.error);

