import VConsole from "vconsole";

// 判断是否为移动端
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

// 判断是否为开发环境
const isDev = () => {
  return import.meta.env.DEV;
};

// 全局调试状态
let globalDebugMode = false;

// 设置调试模式状态
export const setDebugMode = (enabled: boolean) => {
  globalDebugMode = enabled;
  // 将状态保存到localStorage，页面刷新后保持
  localStorage.setItem("debug-mode", enabled.toString());
};

// 获取调试模式状态
export const getDebugMode = () => {
  // 优先使用内存中的状态
  if (globalDebugMode) return true;

  // 检查localStorage中的状态
  const saved = localStorage.getItem("debug-mode");
  if (saved === "true") {
    globalDebugMode = true;
    return true;
  }

  return false;
};

// 判断是否启用vconsole
const shouldEnableVConsole = () => {
  // 检查全局调试模式
  if (getDebugMode()) return true;

  // URL参数包含 vconsole=1（支持桌面端和移动端）
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("vconsole") === "1";
};

let vConsole: VConsole | null = null;

// 初始化vconsole
export const initVConsole = () => {
  if (shouldEnableVConsole() && !vConsole) {
    vConsole = new VConsole({
      theme: "light", // 主题：'light' | 'dark'
      defaultPlugins: ["system", "network", "element", "storage"], // 默认插件
      maxLogNumber: 1000, // 最大日志数量
      onReady: () => {
        console.log("🚀 VConsole 已启动，调试模式开启");
        console.log("💡 提示：访问时添加 ?vconsole=1 参数来启用调试");
        console.log("🎯 或者连续点击5次左上角标题来切换调试模式");
      },
      onClearLog: () => {
        console.log("🧹 日志已清空");
      },
    });

    // 添加一些有用的调试信息
    console.log("🔧 调试信息：");
    console.log("🌐 User Agent:", navigator.userAgent);
    console.log("📏 屏幕尺寸:", `${window.innerWidth} x ${window.innerHeight}`);
    console.log("🔍 设备像素比:", window.devicePixelRatio);
    console.log("🌍 语言:", navigator.language);
    console.log("⏰ 当前时间:", new Date().toLocaleString());
    console.log("📱 设备类型:", isMobile() ? "移动端" : "桌面端");

    // 添加全局调试函数
    (window as any).debugInfo = {
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth} x ${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio,
      language: navigator.language,
      timestamp: new Date().toLocaleString(),
      isMobile: isMobile(),
      isDev: isDev(),
    };

    return vConsole;
  }

  return null;
};

// 销毁vconsole
export const destroyVConsole = () => {
  if (vConsole) {
    vConsole.destroy();
    vConsole = null;
    console.log("🔚 VConsole 已关闭");
  }
};

// 切换vconsole显示状态
export const toggleVConsole = () => {
  const currentMode = getDebugMode();
  setDebugMode(!currentMode);

  if (!currentMode) {
    // 开启调试模式
    initVConsole();
  } else {
    // 关闭调试模式
    destroyVConsole();
  }
};

// 添加自定义日志函数
export const debugLog = {
  info: (message: string, ...args: any[]) => {
    console.log(`ℹ️ [INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`⚠️ [WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`❌ [ERROR] ${message}`, ...args);
  },
  success: (message: string, ...args: any[]) => {
    console.log(`✅ [SUCCESS] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    console.log(`🐛 [DEBUG] ${message}`, ...args);
  },
};

// 导出工具函数
export { isMobile, isDev, shouldEnableVConsole };
