#!/bin/bash

# HST 故事时间轴管理系统启动脚本

echo "🚀 启动 HST 故事时间轴管理系统..."

# 检查是否安装了 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ 未找到 pnpm，请先安装 pnpm:"
    echo "npm install -g pnpm"
    exit 1
fi

# 检查是否安装了 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js 版本过低，需要 16+ 版本"
    echo "当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js 版本检查通过: $(node -v)"
echo "✅ pnpm 版本: $(pnpm -v)"

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 检查后端环境变量文件
if [ ! -f "backend/.env" ]; then
    echo "⚠️  后端环境变量文件不存在，创建示例文件..."
    cp backend/env.example backend/.env 2>/dev/null || {
        echo "❌ 无法创建后端环境变量文件，请手动创建 backend/.env"
        echo "参考 backend/env.example 文件"
    }
fi

# 检查前端环境变量文件
if [ ! -f "frontend/.env" ]; then
    echo "⚠️  前端环境变量文件不存在，创建示例文件..."
    cat > frontend/.env << EOF
# API配置
VITE_API_BASE_URL=http://localhost:3000/api

# 应用配置
VITE_APP_TITLE=我的故事时间轴
VITE_APP_VERSION=1.0.0
EOF
    echo "✅ 前端环境变量文件已创建"
fi

# 启动后端服务
echo "🔧 启动后端服务..."
cd backend
pnpm dev &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 5

# 检查后端是否启动成功
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ 后端服务启动成功"
else
    echo "❌ 后端服务启动失败"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# 启动前端服务
echo "🎨 启动前端服务..."
cd frontend
pnpm dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 HST 故事时间轴管理系统启动完成！"
echo ""
echo "📱 前端地址: http://localhost:5173"
echo "🔧 后端API: http://localhost:3000/api"
echo "📊 健康检查: http://localhost:3000/health"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap 'echo ""; echo "🛑 正在停止服务..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT

# 保持脚本运行
wait
