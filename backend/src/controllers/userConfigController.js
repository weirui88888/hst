import UserConfig from '../models/UserConfig.js';

// 获取用户配置
export const getUserConfig = async (req, res) => {
  try {
    // 获取配置，如果没有则创建默认配置
    let config = await UserConfig.findOne();

    if (!config) {
      // 创建默认配置
      config = new UserConfig({
        siteTitle: '多多与贺贺的青春',
        siteEndText: '十二年的陪伴，是最长情的告白',
        epilogueMainTitle: '流转的岁月里，爱从未缺席',
        epilogueSubTitle:
          '多多与贺贺的旅程，注定漫长而璀璨，也注定写满温柔与期待 !',
        timeAxisPosition: 'right',
        seasonalIndicator: false,
        animationsEnabled: true
      });
      await config.save();
    }

    res.json({
      siteTitle: config.siteTitle,
      siteEndText: config.siteEndText,
      epilogueMainTitle: config.epilogueMainTitle,
      epilogueSubTitle: config.epilogueSubTitle,
      timeAxisPosition: config.timeAxisPosition,
      seasonalIndicator: config.seasonalIndicator,
      animationsEnabled: config.animationsEnabled
    });
  } catch (error) {
    console.error('获取用户配置失败:', error);
    res.status(500).json({
      error: '获取用户配置失败',
      message: error.message
    });
  }
};

// 更新用户配置
export const updateUserConfig = async (req, res) => {
  try {
    const {
      siteTitle,
      siteEndText,
      epilogueMainTitle,
      epilogueSubTitle,
      timeAxisPosition,
      seasonalIndicator,
      animationsEnabled
    } = req.body;

    // 验证必填字段
    if (!siteTitle || !siteEndText || !epilogueMainTitle || !epilogueSubTitle) {
      return res.status(400).json({
        error: '缺少必填字段',
        message:
          'siteTitle、siteEndText、epilogueMainTitle 和 epilogueSubTitle 为必填字段'
      });
    }

    // 验证枚举值
    if (timeAxisPosition && !['left', 'right'].includes(timeAxisPosition)) {
      return res.status(400).json({
        error: '无效的timeAxisPosition值',
        message: 'timeAxisPosition 必须是 left 或 right'
      });
    }

    // 先查找现有配置
    let config = await UserConfig.findOne();

    if (config) {
      // 如果存在配置，则更新现有记录
      config.siteTitle = siteTitle;
      config.siteEndText = siteEndText;
      config.epilogueMainTitle = epilogueMainTitle;
      config.epilogueSubTitle = epilogueSubTitle;
      config.timeAxisPosition = timeAxisPosition || 'right';
      config.seasonalIndicator =
        seasonalIndicator !== undefined ? seasonalIndicator : false;
      config.animationsEnabled =
        animationsEnabled !== undefined ? animationsEnabled : true;
      config.updatedAt = new Date();

      await config.save();
    } else {
      // 如果不存在配置，则创建新配置
      config = new UserConfig({
        siteTitle,
        siteEndText,
        epilogueMainTitle,
        epilogueSubTitle,
        timeAxisPosition: timeAxisPosition || 'right',
        seasonalIndicator:
          seasonalIndicator !== undefined ? seasonalIndicator : false,
        animationsEnabled:
          animationsEnabled !== undefined ? animationsEnabled : true
      });

      await config.save();
    }

    res.json({
      message: '配置更新成功',
      config: {
        siteTitle: config.siteTitle,
        siteEndText: config.siteEndText,
        epilogueMainTitle: config.epilogueMainTitle,
        epilogueSubTitle: config.epilogueSubTitle,
        timeAxisPosition: config.timeAxisPosition,
        seasonalIndicator: config.seasonalIndicator,
        animationsEnabled: config.animationsEnabled
      }
    });
  } catch (error) {
    console.error('更新用户配置失败:', error);
    res.status(500).json({
      error: '更新用户配置失败',
      message: error.message
    });
  }
};
