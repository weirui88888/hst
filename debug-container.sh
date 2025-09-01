#!/bin/bash

echo "🔍 检查后端容器状态..."
docker ps | grep hst-backend

echo ""
echo "📋 容器日志（最近50行）..."
docker logs --tail 50 hst-backend

echo ""
echo "🌐 测试健康检查..."
curl -s http://localhost:6766/health || echo "❌ 健康检查失败"

echo ""
echo "📊 测试API..."
curl -s http://localhost:6766/api || echo "❌ API测试失败"

echo ""
echo "🔧 进入容器查看文件..."
echo "执行以下命令进入容器："
echo "docker exec -it hst-backend /bin/sh"
echo ""
echo "在容器内可以执行："
echo "- cat .env          # 查看环境变量"
echo "- ls -la src/       # 查看源代码"
echo "- env | grep PORT   # 查看端口配置"
