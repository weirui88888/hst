import UserConfig from '../models/UserConfig.js';

// 获取用户配置
export const getUserConfig = async (req, res) => {
  try {
    // 获取最新的配置，如果没有则创建默认配置
    let config = await UserConfig.findOne().sort({ createdAt: -1 });
    
    if (!config) {
      // 创建默认配置
      config = new UserConfig({
        siteTitle: '我的故事',
        siteEndText: '— 已到时间轴结尾 —',
        timeAxisPosition: 'right',
        seasonalIndicator: false,
        animationsEnabled: true
      });
      await config.save();
    }

    res.json({
      siteTitle: config.siteTitle,
      siteEndText: config.siteEndText,
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
    const { siteTitle, siteEndText, timeAxisPosition, seasonalIndicator, animationsEnabled } = req.body;

    // 验证必填字段
    if (!siteTitle || !siteEndText) {
      return res.status(400).json({
        error: '缺少必填字段',
        message: 'siteTitle 和 siteEndText 为必填字段'
      });
    }

    // 验证枚举值
    if (timeAxisPosition && !['left', 'right'].includes(timeAxisPosition)) {
      return res.status(400).json({
        error: '无效的timeAxisPosition值',
        message: 'timeAxisPosition 必须是 left 或 right'
      });
    }

    // 创建新配置
    const config = new UserConfig({
      siteTitle,
      siteEndText,
      timeAxisPosition: timeAxisPosition || 'right',
      seasonalIndicator: seasonalIndicator !== undefined ? seasonalIndicator : false,
      animationsEnabled: animationsEnabled !== undefined ? animationsEnabled : true
    });

    await config.save();

    res.json({
      message: '配置更新成功',
      config: {
        siteTitle: config.siteTitle,
        siteEndText: config.siteEndText,
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

