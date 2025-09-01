import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

console.log('🧪 测试 Backend 配置...');

// 检查环境变量
console.log('📋 环境变量检查:');
console.log(`   PORT: ${process.env.PORT || 3000}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/hst-app'}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);

// 检查文件是否存在
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // 检查主入口文件
  const appPath = join(__dirname, 'src', 'app.js');
  readFileSync(appPath);
  console.log('✅ src/app.js 存在');

  // 检查路由文件
  const userConfigRoutePath = join(__dirname, 'src', 'routes', 'userConfig.js');
  const timelineRoutePath = join(__dirname, 'src', 'routes', 'timeline.js');
  readFileSync(userConfigRoutePath);
  readFileSync(timelineRoutePath);
  console.log('✅ 路由文件存在');

  // 检查模型文件
  const userConfigModelPath = join(__dirname, 'src', 'models', 'UserConfig.js');
  const timelineModelPath = join(__dirname, 'src', 'models', 'TimelineItem.js');
  readFileSync(userConfigModelPath);
  readFileSync(timelineModelPath);
  console.log('✅ 模型文件存在');

  // 检查控制器文件
  const userConfigControllerPath = join(__dirname, 'src', 'controllers', 'userConfigController.js');
  const timelineControllerPath = join(__dirname, 'src', 'controllers', 'timelineController.js');
  readFileSync(userConfigControllerPath);
  readFileSync(timelineControllerPath);
  console.log('✅ 控制器文件存在');

  console.log('\n🎉 Backend 配置检查完成！');
  console.log('💡 运行以下命令启动后端:');
  console.log('   pnpm dev:backend');
  console.log('   或者');
  console.log('   cd backend && npm run dev');

} catch (error) {
  console.error('❌ 文件检查失败:', error.message);
  process.exit(1);
}

