# Emoji 选择器功能说明

## 功能概述

已在录入弹窗（UploadDialog）中集成了emoji选择器功能，用户可以在输入内容时方便地添加emoji表情。

## 技术实现

### 1. EmojiPicker 组件

- 位置：`src/components/EmojiPicker.vue`
- 使用 `emoji-mart` 库实现
- 采用远程数据获取方式，减少应用包体积
- 支持暗黑和浅色主题

### 2. 远程数据获取

```javascript
// 使用 CDN 获取 emoji 数据
const response = await fetch("https://cdn.jsdelivr.net/npm/@emoji-mart/data");
const data = await response.json();
```

**优点：**

- 数据按需获取，不影响应用包体积
- 始终使用最新的emoji数据

**缺点：**

- 需要网络连接
- 首次加载可能有延迟

### 3. 集成位置

- 在录入弹窗的内容输入框右侧添加了emoji选择按钮
- 点击按钮弹出emoji选择器
- 选择emoji后自动插入到光标位置

## 使用方法

1. 点击导航栏的"录入"按钮打开录入弹窗
2. 在内容输入框中点击右侧的emoji按钮（😊图标）
3. 在弹出的emoji选择器中选择想要的表情
4. emoji会自动插入到光标位置

## 样式特性

- 响应式设计，支持移动端和桌面端
- 自动适配暗黑/浅色主题
- 点击外部区域自动关闭选择器
- 平滑的动画过渡效果

## 技术细节

### 依赖

- `emoji-mart`: ^5.6.0

### 主要功能

- 动态导入emoji-mart库
- 远程获取emoji数据
- 主题适配
- 事件处理（选择、关闭）
- 内存管理（组件销毁时清理）

### 事件处理

- `@emoji-select`: 当用户选择emoji时触发
- 自动将选中的emoji插入到文本输入框的光标位置
- 选择后自动关闭选择器

## 注意事项

1. 首次使用需要网络连接来获取emoji数据
2. 如果网络不稳定，emoji选择器可能无法正常加载
3. 建议在良好的网络环境下使用此功能
