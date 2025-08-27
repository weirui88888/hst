import type { Directive } from 'vue';
import { useEffectsStore } from '../stores/effects';

export const vIntersect: Directive<HTMLElement, string | undefined> = {
  mounted(el, binding) {
    const base = binding.value || 'fade-up';
    const effects = useEffectsStore();

    const initialClass = (() => {
      switch (base) {
        case 'fade-left':
          return 'opacity-0 -translate-x-8';
        case 'fade-right':
          return 'opacity-0 translate-x-8';
        case 'fade-up':
        default:
          return 'opacity-0 translate-y-8';
      }
    })();

    if (effects.animationsEnabled) {
      el.classList.add(...('transition-all duration-700 ease-out will-change-transform will-change-opacity '.trim() + ' ' + initialClass).split(' '));
    }

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (effects.animationsEnabled) {
            el.classList.remove('opacity-0', '-translate-x-8', 'translate-x-8', 'translate-y-8');
            el.classList.add('opacity-100', 'translate-x-0', 'translate-y-0');
          }
          io.unobserve(el);
        }
      }
    }, { threshold: 0.15 });

    io.observe(el);
  },
};


