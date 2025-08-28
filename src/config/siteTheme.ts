export const SITE_MAIN_COLOR = '#ea580c';

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
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
  root.style.setProperty('--site-main-color', color);
  root.style.setProperty('--site-main-color-30', hexToRgba(color, 0.3));
}
