import configConventional from "@commitlint/config-conventional";

export default {
  ...configConventional,
  rules: {
    ...configConventional.rules,
    // 允许首字母大写和句子格式
    "subject-case": [0, "never"],
    // 允许句号结尾
    "subject-full-stop": [0, "never"],
  },
};
