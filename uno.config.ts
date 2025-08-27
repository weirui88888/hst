import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({ scale: 1.2 })
  ],
  theme: {
    colors: {
      warm: {
        bg: '#f7f4ef',
        text: '#6b4e3d',
        accent: '#f0a66b'
      }
    }
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: 'i-carbon-moon i-carbon-sun'.split(' '),
});


