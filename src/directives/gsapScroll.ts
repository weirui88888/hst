import type { Directive } from 'vue';
import { useEffectsStore } from '../stores/effects';

type Direction = 'left' | 'right' | 'up' | 'down';
type GsapOptions = {
  direction?: Direction;
  distance?: number; // px
  duration?: number; // s
  ease?: string;
  skew?: number; // deg
  rotate?: number; // deg
  scale?: number; // 0.0-1.0
  stagger?: number; // s
  scrub?: boolean | number; // true/seconds
  once?: boolean;
};

function getFrom(
  opts: Required<Pick<GsapOptions, 'direction' | 'distance'>> &
    Omit<GsapOptions, 'direction' | 'distance'>,
) {
  const { direction, distance } = opts;
  const base: Record<string, number> = { opacity: 0 } as any;
  if (direction === 'left') base.x = -distance;
  else if (direction === 'right') base.x = distance;
  else if (direction === 'up') base.y = -distance;
  else base.y = distance; // down
  if (opts.skew) (base as any).skewY = opts.skew;
  if (opts.rotate) (base as any).rotate = opts.rotate;
  if (opts.scale && opts.scale !== 1) (base as any).scale = opts.scale;
  return base;
}

export const vGsap: Directive<HTMLElement, Direction | GsapOptions | undefined> = {
  async mounted(el, binding) {
    const effects = useEffectsStore();
    const value = binding.value;
    const options: GsapOptions = typeof value === 'string' ? { direction: value } : value || {};
    const opts: Required<GsapOptions> = {
      direction: options.direction ?? 'up',
      distance: options.distance ?? 72,
      duration: options.duration ?? 0.9,
      ease: options.ease ?? 'power3.out',
      skew: options.skew ?? 0,
      rotate: options.rotate ?? 0,
      scale: options.scale ?? 1,
      stagger: options.stagger ?? 0,
      scrub: options.scrub ?? false,
      once: options.once ?? true,
    } as Required<GsapOptions>;

    // 若关闭动画，直接显示并清理可能的动画
    if (!effects.animationsEnabled) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      // 清理可能的GSAP动画
      try {
        const gsapMod = await import(/* @vite-ignore */ 'gsap');
        const gsap = gsapMod?.default ?? gsapMod;
        if (gsap) {
          gsap.killTweensOf(el);
        }
      } catch {
        // ignore
      }
      return;
    }

    // 尝试动态加载 gsap + ScrollTrigger
    let gsap: any | null = null;
    let ScrollTrigger: any | null = null;
    try {
      const gsapMod = await import(/* @vite-ignore */ 'gsap');
      const stMod = await import(/* @vite-ignore */ 'gsap/ScrollTrigger');
      gsap = gsapMod?.default ?? gsapMod;
      ScrollTrigger = stMod?.ScrollTrigger ?? stMod?.default ?? null;
      if (gsap && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }
    } catch {
      // ignore, fallback to CSS
    }

    if (gsap && ScrollTrigger) {
      const fromVars = getFrom(opts);
      const toVars: any = {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        skewY: 0,
        scale: 1,
        duration: opts.duration,
        ease: opts.ease,
      };

      const targets: HTMLElement[] =
        opts.stagger && el.children && el.children.length
          ? (Array.from(el.children) as HTMLElement[])
          : [el];

      gsap.fromTo(targets, fromVars, {
        ...toVars,
        stagger: opts.stagger,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: opts.scrub ? 'play none none none' : 'play none none none',
          scrub: opts.scrub,
          once: opts.once,
        },
      });
    } else {
      // Fallback：使用 CSS 过渡 + IntersectionObserver
      const from = getFrom(opts);
      el.style.transition =
        'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.opacity = '0';
      const transformParts: string[] = [];
      if (typeof (from as any).x === 'number')
        transformParts.push(`translateX(${(from as any).x}px)`);
      if (typeof (from as any).y === 'number')
        transformParts.push(`translateY(${(from as any).y}px)`);
      if ((from as any).rotate) transformParts.push(`rotate(${(from as any).rotate}deg)`);
      if ((from as any).skewY) transformParts.push(`skewY(${(from as any).skewY}deg)`);
      if ((from as any).scale) transformParts.push(`scale(${(from as any).scale})`);
      el.style.transform = transformParts.join(' ');

      const io = new (window as any).IntersectionObserver(
        (entries: any[]) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              el.style.opacity = '1';
              el.style.transform =
                'translateX(0px) translateY(0px) rotate(0deg) skewY(0deg) scale(1)';
              io.unobserve(el);
            }
          }
        },
        { threshold: 0.15 },
      );
      io.observe(el);
    }
  },

  // 添加更新钩子，当动画状态改变时重新处理
  updated(el, binding) {
    const effects = useEffectsStore();

    // 如果动画被关闭，清理所有动画效果
    if (!effects.animationsEnabled) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'none';

      // 清理GSAP动画
      try {
        import(/* @vite-ignore */ 'gsap').then((gsapMod) => {
          const gsap = gsapMod?.default ?? gsapMod;
          if (gsap) {
            gsap.killTweensOf(el);
          }
        });
      } catch {
        // ignore
      }
    }
  },
};
