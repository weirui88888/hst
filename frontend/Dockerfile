# 使用nginx作为基础镜像
FROM nginx:alpine

# 复制构建产物到nginx目录
COPY dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 6767

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
