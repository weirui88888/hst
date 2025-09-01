# 使用官方Node.js运行时作为基础镜像
FROM node:22-alpine AS base

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装pnpm
RUN npm install -g pnpm@9

# 安装依赖
RUN pnpm install

# 生产阶段
FROM base AS production
# 复制源代码（包含已创建的.env.production文件）
COPY . .

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 更改文件所有权
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 6766
CMD ["pnpm", "start"]
