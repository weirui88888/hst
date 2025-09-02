import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";

export default [
  // 基础 JavaScript 规则
  js.configs.recommended,

  // 全局配置
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",
      },
    },
    rules: {
      "no-console": "warn",
      "no-debugger": "warn",
      "no-unused-vars": "warn",
      "prefer-const": "warn",
      "no-var": "error",
    },
  },

  // JavaScript 文件配置
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "no-undef": "warn",
      "no-unused-vars": "warn",
    },
  },

  // Prettier 配置
  {
    plugins: {
      prettier: prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  // 忽略特定文件
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".git/**",
      "*.min.js",
      "coverage/**",
      ".next/**",
      ".nuxt/**",
      ".output/**",
    ],
  },
];
