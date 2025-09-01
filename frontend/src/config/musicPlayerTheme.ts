// 音乐播放器主题配置
export interface MusicPlayerTheme {
  // 主体色调
  primary: {
    light: string; // 浅色主题下的主体色调
    dark: string; // 深色主题下的主体色调
  };
  // CD背景图片
  cdBackground: {
    image: string; // CD背景图片地址
  };
}

// 主题配置
export const MUSIC_PLAYER_THEME: MusicPlayerTheme = {
  primary: {
    light: '#1e293b', // 浅色主题下的主体色调（深色）
    dark: '#f8fafc', // 深色主题下的主体色调（浅色）
  },
  cdBackground: {
    image: 'https://hst-oss.xdzi8b.cn/hst/7d9f949f5c0a299d7b387c205cce646a.jpg', // CD背景图片地址
  },
};

// 获取当前主题的颜色系统
export function getMusicPlayerColors(isDarkTheme: boolean) {
  const primaryColor = isDarkTheme
    ? MUSIC_PLAYER_THEME.primary.dark
    : MUSIC_PLAYER_THEME.primary.light;

  console.log(`Theme is dark: ${isDarkTheme}, Primary color: ${primaryColor}`);

  // 直接根据主题模式生成颜色系统，而不是根据主色调
  if (isDarkTheme) {
    // 暗黑主题 - 生成暗黑系统
    console.log('Generating dark color system for dark theme');
    return {
      background: '#1e293b',
      border: '#374151',
      cd: {
        background: '#374151',
        border: '#6b7280',
      },
      controls: {
        background: '#ffffff',
        border: '#6b7280',
      },
      decorations: {
        lines: '#6b7280',
        accents: '#6b7280',
      },
    };
  } else {
    // 亮色主题 - 生成亮色系统
    console.log('Generating light color system for light theme');
    return {
      background: '#f8fafc',
      border: '#e2e8f0',
      cd: {
        background: '#64748b',
        border: '#475569',
      },
      controls: {
        background: '#ffffff',
        border: '#475569',
      },
      decorations: {
        lines: '#475569',
        accents: '#475569',
      },
    };
  }
}

// 生成CSS变量
export function generateMusicPlayerCSSVariables(isDarkTheme: boolean): Record<string, string> {
  const colors = getMusicPlayerColors(isDarkTheme);

  return {
    '--music-bg-color': colors.background,
    '--music-border-color': colors.border,
    '--music-cd-bg': colors.cd.background,
    '--music-cd-border': colors.cd.border,
    '--music-control-bg': colors.controls.background,
    '--music-control-border': colors.controls.border,
    '--music-decoration-lines': colors.decorations.lines,
    '--music-decoration-accents': colors.decorations.accents,
    '--music-cd-background-image': `url(${MUSIC_PLAYER_THEME.cdBackground.image})`,
    '--music-progress-bg': isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.15)',
    '--music-progress-fill': isDarkTheme ? '#6b7280' : '#1e293b',
    '--music-progress-thumb-bg': isDarkTheme ? '#ffffff' : '#000000',
    '--music-progress-thumb-border': isDarkTheme ? '#6b7280' : '#000000',
  };
}
