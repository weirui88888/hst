// ESLint v9 flat config
// Docs: https://eslint.org/docs/latest/use/configure/configuration-files-new

// @eslint/js provides core recommended rules
const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const vuePlugin = require('eslint-plugin-vue');
const prettierPlugin = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '**/*.min.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // 在全局层面也关闭 no-undef，避免类型名在 TS/Vue 中被误判
      'no-undef': 'off',
    },
  },
  // Base JS recommended
  js.configs.recommended,
  // Vue 3 recommended
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: require('vue-eslint-parser'),
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue: vuePlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...vuePlugin.configs['flat/recommended'].rules,
      'vue/multi-word-component-names': 'off',
      'prettier/prettier': 'warn',
      // 关闭 no-undef（.vue 中 TS 类型标识会被误报）
      'no-undef': 'off',
    },
  },
  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'prettier/prettier': 'warn',
      // 关闭 no-undef（TS 类型名、内置 DOM 类型会被误报）
      'no-undef': 'off',
    },
  },
  // Apply Prettier config to turn off conflicting rules
  eslintConfigPrettier,
];
