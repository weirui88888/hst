# 数据库操作脚本

这个文件夹包含了用于快速操作数据库的脚本工具，所有示例都基于你的实际项目数据库结构。

## 📁 脚本文件

### 1. `analyze_db_structure.js` - 数据库结构分析脚本

用于分析数据库集合结构，获取真实的字段信息和数据样本。

```bash
# 分析所有集合
node analyze_db_structure.js

# 分析特定集合
node analyze_db_structure.js -c timeline

# 分析并生成脚本使用示例
node analyze_db_structure.js -e

# 分析特定集合并生成示例
node analyze_db_structure.js -c userConfig -e
```

### 2. `add_field.js` - 添加字段脚本

用于给数据库集合添加新字段。

```bash
# 给timeline集合添加阅读次数统计
node add_field.js -c timeline -f viewCount -v 0 -t number

# 给特定标签的故事添加优先级 (基于你的标签: "可爱多", "海参", "曲奇)
node add_field.js -c timeline -f priority -v "high" -w '{"tags": "可爱多"}' -t string

# 给userConfig集合添加主题颜色配置
node add_field.js -c userConfig -f themeColor -v "#ff6b6b" -t string -d "#ff6b6b"
```

### 3. `refresh_field.js` - 字段刷新脚本

用于刷新现有字段的值。

```bash
# 取消所有故事的置顶状态
node refresh_field.js -c timeline -f isPinned -v false

# 更新网站标题 (当前: "多多与贺贺的青春")
node refresh_field.js -c userConfig -f siteTitle -v "多多与贺贺的青春时光"

# 切换时间轴位置 (当前: "left", 可选: "left" 或 "right")
node refresh_field.js -c userConfig -f timeAxisPosition -v "right"
```

## 🗄️ 数据库集合说明

### Timeline集合 (时间轴故事条目)

- **用途**: 管理时间轴上的故事条目
- **主要字段**:
  - `title`: 故事标题 (如: "多多")
  - `content`: 故事正文内容
  - `tags`: 标签数组 (如: ["可爱多", "海参", "曲奇"])
  - `date`: 故事发生的日期
  - `media`: 媒体文件数组 (图片/视频)
  - `isPinned`: 是否置顶显示
  - `isPublic`: 是否公开显示

### UserConfig集合 (用户配置)

- **用途**: 管理网站的整体配置
- **主要字段**:
  - `siteTitle`: 网站主标题 (当前: "多多与贺贺的青春")
  - `siteEndText`: 时间轴结尾文案 (当前: "十二年的陪伴，是最长情的告白")
  - `timeAxisPosition`: 时间轴位置 ("left" 或 "right")
  - `seasonalIndicator`: 季节指示器开关
  - `animationsEnabled`: 动画效果开关
  - `siteMusic`: 背景音乐文件名 (当前: "you-are-the-reason")

## 🚀 快速开始

1. **查看数据库结构**:

   ```bash
   node analyze_db_structure.js -e
   ```

2. **查看集合字段**:

   ```bash
   node add_field.js -c timeline -l
   node add_field.js -c userConfig -l
   ```

3. **添加新字段**:

   ```bash
   # 给所有故事添加阅读次数
   node add_field.js -c timeline -f viewCount -v 0 -t number
   ```

4. **刷新字段值**:
   ```bash
   # 更新网站标题
   node refresh_field.js -c userConfig -f siteTitle -v "新的标题"
   ```

## 📝 常用操作示例

### 基于你的真实数据操作

```bash
# 给特定标签的故事设置置顶
node refresh_field.js -c timeline -f isPinned -v true -w '{"tags": "可爱多"}'

# 给特定日期的故事添加特殊标记
node refresh_field.js -c timeline -f isPinned -v true -w '{"date": {"$gte": "2025-01-01"}}'

# 给特定标题的故事更新内容
node refresh_field.js -c timeline -f content -v "新的故事内容" -w '{"title": "多多"}'

# 给所有故事添加统一的标签
node refresh_field.js -c timeline -f tags -v '["回忆", "珍贵"]'

# 给特定标签的故事更新置顶状态
node refresh_field.js -c timeline -f isPinned -v true -w '{"tags": {"$in": ["可爱多", "海参"]}}'
```

### 用户配置管理

```bash
# 更新网站标题
node refresh_field.js -c userConfig -f siteTitle -v "多多与贺贺的青春时光"

# 更新结尾文案
node refresh_field.js -c userConfig -f siteEndText -v "— 我们的故事还在继续 —"

# 切换时间轴位置
node refresh_field.js -c userConfig -f timeAxisPosition -v "right"

# 开启季节指示器
node refresh_field.js -c userConfig -f seasonalIndicator -v true

# 关闭动画效果
node refresh_field.js -c userConfig -f animationsEnabled -v false

# 更换背景音乐
node refresh_field.js -c userConfig -f siteMusic -v "bleeding-love"
```

## ⚠️ 注意事项

1. **备份数据**: 在执行任何数据库操作前，建议先备份数据
2. **测试环境**: 建议先在测试环境中验证脚本功能
3. **权限检查**: 确保有足够的数据库操作权限
4. **字段验证**: 添加字段时注意类型匹配和约束条件

## 🔧 环境要求

- Node.js
- MongoDB
- 项目依赖包 (mongoose, dotenv)

## 📞 帮助

每个脚本都支持 `-h` 或 `--help` 参数查看详细帮助信息：

```bash
node add_field.js -h
node refresh_field.js -h
node analyze_db_structure.js -h
```
