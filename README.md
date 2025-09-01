# HST 故事时间轴管理系统

一个基于Vue3 + Node.js的现代化故事时间轴管理系统，支持真实数据库存储和API调用。

## 功能特性

- 🎨 **现代化UI设计** - 支持浅色/暗黑主题切换
- 📱 **响应式布局** - 完美适配桌面端和移动端
- 🎵 **背景音乐** - 支持自动播放和手动控制
- 📸 **媒体支持** - 支持图片和视频展示
- ⚙️ **配置管理** - 灵活的系统配置选项
- 🔄 **实时同步** - 前后端数据实时同步
- 🛡️ **错误处理** - 完善的错误处理和重试机制

## 技术栈

### 前端
- Vue 3 + TypeScript
- Pinia 状态管理
- Element Plus UI组件
- UnoCSS 原子化CSS
- Vite 构建工具

### 后端
- Node.js + Express
- MongoDB + Mongoose
- JWT 认证
- CORS 跨域支持
- 请求限流保护

## 快速开始

### 1. 环境要求
- Node.js 16+
- MongoDB 4.4+
- pnpm (推荐) 或 npm

### 2. 安装依赖

```bash
# 安装根目录依赖
pnpm install

# 安装前端依赖
cd frontend
pnpm install

# 安装后端依赖
cd ../backend
pnpm install
```

### 3. 环境配置

#### 后端配置 (backend/.env)
```env
# 数据库配置
MONGODB_URI=mongodb://localhost:27017/hst-app

# 服务器配置
PORT=3000
NODE_ENV=development

# 安全配置
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 前端配置 (frontend/.env)
```env
# API配置
VITE_API_BASE_URL=http://localhost:3000/api

# 应用配置
VITE_APP_TITLE=多多与贺贺的青春
VITE_APP_VERSION=1.0.0
```

### 4. 启动服务

#### 开发模式
```bash
# 启动后端服务
cd backend
pnpm dev

# 启动前端服务 (新终端)
cd frontend
pnpm dev
```

#### 生产模式
```bash
# 构建前端
cd frontend
pnpm build

# 启动后端
cd ../backend
pnpm start
```

### 5. 访问应用
- 前端: http://localhost:5173
- 后端API: http://localhost:3000/api
- API文档: http://localhost:3000/api

## API接口

### 时间轴管理
- `GET /api/timeline/items` - 获取时间轴项目列表
- `GET /api/timeline/pinned` - 获取置顶项目
- `POST /api/timeline/items` - 创建时间轴项目
- `PUT /api/timeline/items/:id` - 更新时间轴项目
- `DELETE /api/timeline/items/:id` - 删除时间轴项目

### 用户配置
- `GET /api/user/config` - 获取用户配置
- `POST /api/user/config` - 更新用户配置

## 数据模型

### TimelineItem (时间轴项目)
```typescript
{
  id: string;
  title: string;
  content: string;
  tags: string[];
  date: string; // YYYY-MM-DD格式
  media?: Array<{
    type: 'image' | 'video';
    url: string;
    aspectRatio?: string;
  }>;
  isPinned?: boolean;
}
```

### UserConfig (用户配置)
```typescript
{
  siteTitle: string;
  siteEndText: string;
  timeAxisPosition: 'left' | 'right';
  seasonalIndicator: boolean;
  animationsEnabled: boolean;
}
```

## 部署说明

### Docker部署
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

### 手动部署
1. 确保MongoDB服务正常运行
2. 配置环境变量
3. 构建前端项目
4. 启动后端服务
5. 配置Nginx反向代理（可选）

## 开发指南

### 添加新功能
1. 在后端添加API接口
2. 在前端API服务层添加对应方法
3. 更新store状态管理
4. 修改UI组件

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint代码规范
- 提交前运行测试
- 编写清晰的注释

## 故障排除

### 常见问题

1. **API连接失败**
   - 检查后端服务是否启动
   - 确认API地址配置正确
   - 检查CORS配置

2. **数据库连接失败**
   - 确认MongoDB服务运行
   - 检查数据库连接字符串
   - 验证数据库权限

3. **前端构建失败**
   - 检查Node.js版本
   - 清理node_modules重新安装
   - 检查TypeScript类型错误

### 调试模式
```bash
# 后端调试
cd backend
DEBUG=* pnpm dev

# 前端调试
cd frontend
pnpm dev --debug
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交Issue或联系开发团队。

