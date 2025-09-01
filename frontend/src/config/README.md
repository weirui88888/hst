# 配置文件说明

## UI文本配置 (texts.ts)

### 概述

`texts.ts` 文件集中管理项目中所有用户界面的中文文本，便于后续的国际化支持和文本维护。

### 结构说明

```typescript
export const UI_TEXTS = {
  // 导航栏相关文本
  nav: {
    add: "录入",
    settings: "设置",
    defaultTitle: "多多与贺贺的青春"
  },

  // 设置面板相关文本
  settings: {
    title: "设置",
    pageSettings: "页面设置",
    // ... 更多设置相关文本
  },

  // 上传弹窗相关文本
  upload: {
    title: "录入",
    desktopUploadHint: "点击或拖拽图片到此处上传",
    // ... 更多上传相关文本
  },

  // 空状态相关文本
  empty: {
    noContent: "还没有内容，点击右上角"录入"开始记录吧。"
  },

  // Toast提示相关文本
  toast: {
    saveSuccess: "保存成功"
  }
}
```

### 使用方法

1. **在组件中导入**：

```typescript
import { UI_TEXTS } from '../config/texts';
```

2. **在模板中使用**：

```vue
<template>
  <h1>{{ UI_TEXTS.nav.defaultTitle }}</h1>
  <button :title="UI_TEXTS.nav.add">录入</button>
</template>
```

3. **在脚本中使用**：

```typescript
// 显示Toast提示
(window as any).$toast?.success(UI_TEXTS.toast.saveSuccess);
```

### 优势

1. **统一管理** - 所有UI文本集中在一个文件中
2. **易于维护** - 修改文本只需要改一个地方
3. **国际化支持** - 后续可以轻松扩展多语言支持
4. **类型安全** - TypeScript提供完整的类型检查
5. **代码整洁** - 组件中不再有硬编码的中文文本

### 扩展建议

后续可以基于此配置文件实现国际化功能：

```typescript
// 示例：多语言支持
const LANGUAGES = {
  zh: UI_TEXTS,
  en: {
    nav: {
      add: 'Add',
      settings: 'Settings',
      defaultTitle: 'My Story',
    },
    // ... 英文文本
  },
};
```

### 注意事项

- 所有文本都应该使用配置文件中的值，避免硬编码
- 新增文本时，请按照现有结构添加到相应的分类中
- 修改文本时，请确保所有使用该文本的地方都已更新
