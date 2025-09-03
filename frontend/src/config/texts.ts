/**
 * UI文本配置文件
 * 集中管理所有用户界面中的中文文本
 * 便于后续国际化支持和文本维护
 */
export const UI_TEXTS = {
  // 导航栏
  nav: {
    add: "录入",
    settings: "设置",
    defaultTitle: "多多与贺贺的青春",
  },

  // 设置面板
  settings: {
    title: "设置",
    pageSettings: "页面设置",
    timelineSettings: "时间轴设置",
    otherSettings: "其他设置",

    // 页面动画
    pageAnimation: {
      title: "页面动画",
      description: "开启或关闭页面过渡动画效果",
      on: "开启",
      off: "关闭",
    },

    // 站点标题
    siteTitle: {
      title: "站点标题",
      description: "修改页面左上角主标题",
      placeholder: "多多与贺贺的青春",
    },

    // 时间轴开始文案
    endText: {
      title: "时间轴开始文案",
      description: "设置时间轴故事的开始提示文案",
      placeholder: "十二年的陪伴，是最长情的告白",
      default: "十二年的陪伴，是最长情的告白",
    },

    // 尾声寄语
    epilogueMessage: {
      title: "尾声寄语",
      description: "设置页面底部的尾声寄语文案",
      mainTitle: "主寄语",
      mainPlaceholder: "流转的岁月里，爱从未缺席",
      mainDefault: "流转的岁月里，爱从未缺席",
      subTitle: "副寄语",
      subPlaceholder:
        "多多与贺贺的旅程，注定漫长而璀璨，也注定写满温柔与期待 !",
      subDefault: "多多与贺贺的旅程，注定漫长而璀璨，也注定写满温柔与期待 !",
    },

    // 时间轴位置
    timelinePosition: {
      title: "时间轴位置",
      left: "左侧",
      right: "右侧",
      leftDesc: "显示在左侧",
      rightDesc: "显示在右侧",
    },

    // 季节标识
    seasonalIndicator: {
      title: "季节标识",
      description: "在时间轴上显示春夏秋冬标识",
    },

    // 音乐自动播放
    musicAutoPlay: {
      title: "音乐自动播放",
      description: "首次滚动页面时自动播放背景音乐",
      on: "开启",
      off: "关闭",
      tip: "如果音乐无法播放，请前往浏览器设置 → 声音 → 允许播放声音，并添加当前网站",
    },

    // 其他
    moreSettings: "更多设置选项将在这里添加...",
    save: "保存",
    cancel: "取消",
  },

  // 上传弹窗
  upload: {
    title: "录入",
    editTitle: "调整",
    desktopUploadHint: "点击或拖拽图片到此处上传",
    mobileUploadHint: "点击选择图片到此处上传",
    deleteImage: "删除已上传图片",
    closePreview: "关闭预览",
    titlePlaceholder: "请输入标题",
    contentPlaceholder: "请输入内容",
    tagsPlaceholder: "请输入标签，支持空格或逗号分隔",
    datePlaceholder: "选择日期 YYYY-MM-DD",
    saveButton: "录入",
    updateButton: "调整",
  },

  // Emoji 选择器
  emojiPicker: {
    title: "选择表情",
    triggerTitle: "添加表情",
  },

  // 空状态
  empty: {
    noContent: "还没有内容，点击右上角录入开始记录吧。",
  },

  // Toast提示
  toast: {
    saveSuccess: "保存成功",
    configUpdated: "配置已更新",
    uploadSuccess: "我们的回忆又+1😊",
    updateSuccess: "调整完成",
    updateFailed: "调整失败，请重试",
    extraButtonsUnlocked: "已开启主人模式",
    extraButtonsHidden: "已关闭主人模式",
  },

  // 故事延续文案（默认值，实际使用配置中的值）
  storyContinuation: {
    title: "流转的岁月里，爱从未缺席",
    subtitle: "多多与贺贺的旅程，注定漫长而璀璨，也注定写满温柔与期待 !",
  },
} as const;

// 导出类型定义
export type UITexts = typeof UI_TEXTS;
