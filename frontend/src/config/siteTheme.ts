export const SITE_MAIN_COLOR = "#ea580c";

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized,
    16,
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function applySiteThemeCSSVariables(color: string = SITE_MAIN_COLOR) {
  const root = document.documentElement;
  root.style.setProperty("--site-main-color", color);
  root.style.setProperty("--site-main-color-30", hexToRgba(color, 0.3));
}

// 主题色（用于浏览器地址栏/系统 UI），避免硬编码，集中管理
export const THEME_COLOR_LIGHT = "#ffffff";
export const THEME_COLOR_DARK = "#0a0a0a";

export type PreferredTheme = "light" | "dark";

export function getThemeColorForMode(mode: PreferredTheme): string {
  return mode === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
}

export function detectCurrentTheme(): PreferredTheme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyMetaThemeColor(mode?: PreferredTheme) {
  const currentMode = mode ?? detectCurrentTheme();
  const resolvedColor =
    getBodyBackgroundColor() || getThemeColorForMode(currentMode);

  let meta = document.querySelector(
    'meta[name="theme-color"]',
  ) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta") as HTMLMetaElement;
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  (meta as HTMLMetaElement).setAttribute("content", resolvedColor);
}

function getBodyBackgroundColor(): string {
  if (typeof window === "undefined" || !document?.body) return "";
  const bg = window.getComputedStyle(document.body).backgroundColor;
  // 过滤透明色
  if (!bg || bg === "transparent" || bg === "rgba(0, 0, 0, 0)") return "";
  return bg;
}
