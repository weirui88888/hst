# 字段刷新脚本使用说明

## 概述

`refresh_field.js` 是一个命令行工具，用于刷新指定数据库集合中的字段值。该脚本支持 MongoDB 数据库，可以批量更新记录中的特定字段。

## 功能特性

- ✅ 支持多个集合（timeline, userConfig）
- ✅ 字段验证和类型检查
- ✅ 支持条件过滤更新
- ✅ 支持重置为默认值
- ✅ 彩色日志输出
- ✅ 详细的执行结果报告
- ✅ 错误处理和异常捕获

## 安装和配置

### 1. 确保环境变量配置正确

确保 `backend/.env` 文件中的数据库连接配置正确：

```env
MONGODB_URI=mongodb://localhost:27017/hst-app
```

### 2. 安装依赖

```bash
cd backend
npm install
```

## 使用方法

### 基本语法

```bash
node script/refresh_field.js [选项]
```

### 命令行选项

| 选项 | 长选项          | 描述                     | 必需 |
| ---- | --------------- | ------------------------ | ---- |
| `-c` | `--collection`  | 指定集合名称             | 是   |
| `-f` | `--field`       | 指定要刷新的字段名       | 是\* |
| `-v` | `--value`       | 指定新值                 | 否   |
| `-w` | `--where`       | 指定过滤条件（JSON格式） | 否   |
| `-l` | `--list-fields` | 列出指定集合的所有字段   | 否   |
| `-h` | `--help`        | 显示帮助信息             | 否   |

\*当使用 `-l` 选项时，`-f` 不是必需的。

## 使用示例

### 1. 查看帮助信息

```bash
node script/refresh_field.js --help
```

### 2. 列出集合的所有字段

```bash
# 列出 timeline 集合的所有字段
node script/refresh_field.js -c timeline -l

# 列出 userConfig 集合的所有字段
node script/refresh_field.js -c userConfig -l
```

### 3. 刷新字段值

```bash
# 将 timeline 集合中所有记录的 isPinned 字段设置为 false
node script/refresh_field.js -c timeline -f isPinned -v false

# 更新 userConfig 集合中的 siteTitle 字段
node script/refresh_field.js -c userConfig -f siteTitle -v "新的网站标题"

# 将 userConfig 集合中的 seasonalIndicator 字段设置为 true
node script/refresh_field.js -c userConfig -f seasonalIndicator -v true
```

### 4. 条件更新

```bash
# 只更新包含特定标签的 timeline 记录
node script/refresh_field.js -c timeline -f isPinned -v true -w '{"tags": "重要"}'

# 更新特定日期范围的记录
node script/refresh_field.js -c timeline -f isPinned -v false -w '{"date": {"$gte": "2024-01-01"}}'
```

### 5. 重置为默认值

```bash
# 将字段重置为默认值（不指定 -v 参数）
node script/refresh_field.js -c userConfig -f seasonalIndicator
node script/refresh_field.js -c timeline -f isPinned
```

## 支持的集合

### timeline 集合

包含以下主要字段：

- `title`: 标题（字符串）
- `content`: 内容（字符串）
- `tags`: 标签（字符串数组）
- `date`: 日期（Date）
- `media`: 媒体文件（对象数组）
- `isPinned`: 是否置顶（布尔值，默认 false）
- `createdAt`: 创建时间（Date）
- `updatedAt`: 更新时间（Date）

### userConfig 集合

包含以下主要字段：

- `siteTitle`: 网站标题（字符串，默认 "多多与贺贺的青春"）
- `siteEndText`: 网站结束文本（字符串，默认 "十二年的陪伴，是最长情的告白"）
- `epilogueMainTitle`: 结语主标题（字符串）
- `epilogueSubTitle`: 结语副标题（字符串）
- `timeAxisPosition`: 时间轴位置（枚举：left/right，默认 right）
- `seasonalIndicator`: 季节指示器（布尔值，默认 false）
- `animationsEnabled`: 动画启用（布尔值，默认 true）
- `createdAt`: 创建时间（Date）
- `updatedAt`: 更新时间（Date）

## 过滤条件语法

使用 MongoDB 查询语法，支持以下操作符：

```bash
# 等于
-w '{"field": "value"}'

# 不等于
-w '{"field": {"$ne": "value"}}'

# 大于
-w '{"field": {"$gt": 100}}'

# 大于等于
-w '{"field": {"$gte": "2024-01-01"}}'

# 小于
-w '{"field": {"$lt": 100}}'

# 小于等于
-w '{"field": {"$lte": "2024-12-31"}}'

# 包含在数组中
-w '{"tags": {"$in": ["重要", "紧急"]}}'

# 正则表达式
-w '{"title": {"$regex": "测试", "$options": "i"}}'

# 组合条件
-w '{"field1": "value1", "field2": {"$gt": 100}}'
```

## 输出说明

脚本执行后会显示：

1. **连接信息**: 数据库连接状态
2. **执行信息**: 要更新的集合、字段和条件
3. **更新结果**:
   - 匹配记录数：符合过滤条件的记录总数
   - 修改记录数：实际被修改的记录数
   - 插入记录数：新插入的记录数（通常为0）
4. **数据样本**: 更新后的前5条记录示例

## 错误处理

脚本包含完善的错误处理机制：

- ✅ 参数验证
- ✅ 集合和字段存在性检查
- ✅ 数据库连接错误处理
- ✅ JSON 格式验证
- ✅ 未捕获异常处理

## 注意事项

1. **备份数据**: 在执行批量更新前，建议先备份数据库
2. **测试环境**: 建议先在测试环境中验证脚本功能
3. **权限检查**: 确保数据库用户有足够的读写权限
4. **网络连接**: 确保能够正常连接到 MongoDB 数据库
5. **JSON 格式**: 过滤条件必须是有效的 JSON 格式

## 故障排除

### 常见错误

1. **数据库连接失败**

   ```
   ✗ 数据库连接失败: connection refused
   ```

   解决：检查 MongoDB 服务是否运行，检查连接字符串是否正确

2. **集合不存在**

   ```
   ✗ 不支持的集合: invalidCollection
   ```

   解决：使用 `-l` 选项查看支持的集合列表

3. **字段不存在**

   ```
   ✗ 集合 timeline 中不存在字段 invalidField
   ```

   解决：使用 `-l` 选项查看集合的所有可用字段

4. **JSON 格式错误**
   ```
   ✗ 过滤条件格式错误: Unexpected token
   ```
   解决：检查 JSON 语法，确保引号和括号匹配

## 扩展功能

如需添加新的集合支持，请：

1. 在 `src/models/` 目录下创建新的模型文件
2. 在 `COLLECTION_MAP` 中添加新的映射关系
3. 更新此文档中的集合说明

## 版本信息

- 版本：1.0.0
- 兼容性：Node.js 14+, MongoDB 4.0+
- 依赖：mongoose, dotenv
