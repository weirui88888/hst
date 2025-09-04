#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
dotenv.config({ path: join(__dirname, '..', '.env') });

// 导入模型
import TimelineItem from '../src/models/TimelineItem.js';
import UserConfig from '../src/models/UserConfig.js';

// 支持的集合映射
const COLLECTION_MAP = {
  timeline: TimelineItem,
  userConfig: UserConfig
};

// 颜色输出工具
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: msg => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: msg => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: msg => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: msg => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: msg =>
    console.log(`${colors.cyan}${colors.bright}${msg}${colors.reset}`)
};

// 将命令行字符串值转换为合适的JS类型
const parseInputValue = raw => {
  if (raw === undefined) return undefined;
  // 去掉首尾空白
  const valueStr = String(raw).trim();

  // 明确的字面量
  if (valueStr === 'null') return null;
  if (valueStr === 'true') return true;
  if (valueStr === 'false') return false;

  // 数字（整数/小数/负数）
  if (/^-?\d+(?:\.\d+)?$/.test(valueStr)) {
    const num = Number(valueStr);
    if (!Number.isNaN(num)) return num;
  }

  // JSON（数组/对象/被引号包裹的字符串）
  const isLikelyJson =
    valueStr.startsWith('[') ||
    valueStr.startsWith('{') ||
    valueStr.startsWith('"') ||
    valueStr.startsWith("'");

  if (isLikelyJson) {
    try {
      // 处理可能的单引号JSON -> 转为双引号尝试解析
      const normalized =
        valueStr.startsWith("'") && valueStr.endsWith("'")
          ? valueStr.slice(1, -1)
          : valueStr;
      return JSON.parse(normalized);
    } catch (_) {
      // 解析失败则按原样字符串返回
    }
  }

  // 回退：普通字符串
  return valueStr;
};

// 数据库连接
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/hst-app';
    log.info(`正在连接数据库: ${mongoURI.replace(/\/\/.*@/, '//***@')}`);

    await mongoose.connect(mongoURI);
    log.success('数据库连接成功');
  } catch (error) {
    log.error(`数据库连接失败: ${error.message}`);
    process.exit(1);
  }
};

// 断开数据库连接
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    log.info('数据库连接已断开');
  } catch (error) {
    log.error(`断开数据库连接失败: ${error.message}`);
  }
};

// 显示帮助信息
const showHelp = () => {
  log.header('🔄 字段刷新脚本使用说明');
  console.log(`
用法: node refresh_field.js [选项]

选项:
  -c, --collection <name>    指定集合名称 (timeline, userConfig)
  -f, --field <name>         指定要刷新的字段名
  -v, --value <value>        指定新值 (可选，不指定则重置为默认值)
  -w, --where <filter>       指定过滤条件 (JSON格式，可选)
  -l, --list-fields         列出指定集合的所有字段
  -h, --help                显示帮助信息

📚 基于实际数据库的示例:

🎯 Timeline集合 (时间轴故事条目) - 基于你的真实数据:
  # 取消所有故事的置顶状态
  node refresh_field.js -c timeline -f isPinned -v false

  # 将所有故事设为公开状态
  node refresh_field.js -c timeline -f isPublic -v true

  # 只给特定标签的故事设置置顶 (基于你的标签: "可爱多", "海参", "曲奇")
  node refresh_field.js -c timeline -f isPinned -v true -w '{"tags": "可爱多"}'

  # 给特定日期的故事添加特殊标记 (基于你的日期范围)
  node refresh_field.js -c timeline -f isPinned -v true -w '{"date": {"$gte": "2025-01-01"}}'

  # 重置所有故事的标签为空数组
  node refresh_field.js -c timeline -f tags -v '[]'

  # 给有媒体内容的故事更新媒体信息
  node refresh_field.js -c timeline -f media -v '[{"type": "image", "url": "new-url.jpg", "aspectRatio": "16/9"}]' -w '{"media": {"$exists": true}}'

  # 给特定标题的故事更新内容 (基于你的标题: "多多")
  node refresh_field.js -c timeline -f content -v "新的故事内容" -w '{"title": "多多"}'

🎨 UserConfig集合 (用户配置) - 基于你的真实配置:
  # 更新网站标题 (当前: "多多与贺贺的青春")
  node refresh_field.js -c userConfig -f siteTitle -v "多多与贺贺的青春时光"

  # 更新结尾文案 (当前: "十二年的陪伴，是最长情的告白")
  node refresh_field.js -c userConfig -f siteEndText -v "— 我们的故事还在继续 —"

  # 切换时间轴位置 (当前: "left", 可选: "left" 或 "right")
  node refresh_field.js -c userConfig -f timeAxisPosition -v "right"

  # 开启季节指示器 (当前: true)
  node refresh_field.js -c userConfig -f seasonalIndicator -v false

  # 关闭动画效果 (当前: true)
  node refresh_field.js -c userConfig -f animationsEnabled -v false

  # 更换背景音乐 (当前: "you-are-the-reason")
  node refresh_field.js -c userConfig -f siteMusic -v "bleeding-love"

  # 更新结语主标题 (当前: "流转的岁月里，爱从未缺席")
  node refresh_field.js -c userConfig -f epilogueMainTitle -v "时光荏苒，爱意永恒"

  # 更新结语副标题
  node refresh_field.js -c userConfig -f epilogueSubTitle -v "在岁月的长河中，我们的爱情如星辰般闪耀"

🔍 实用操作:
  # 列出timeline集合的所有字段
  node refresh_field.js -c timeline -l

  # 列出userConfig集合的所有字段
  node refresh_field.js -c userConfig -l

  # 重置字段为默认值 (不指定-v参数)
  node refresh_field.js -c userConfig -f seasonalIndicator

  # 批量更新特定条件的故事 (基于你的日期范围)
  node refresh_field.js -c timeline -f isPublic -v false -w '{"date": {"$lt": "2025-01-01"}}'

  # 给所有故事添加统一的标签
  node refresh_field.js -c timeline -f tags -v '["回忆", "珍贵"]'

  # 给特定标签的故事更新置顶状态
  node refresh_field.js -c timeline -f isPinned -v true -w '{"tags": {"$in": ["可爱多", "海参"]}}'

💡 业务场景说明:
  - timeline: 管理时间轴故事条目，可刷新置顶状态、公开性、标签等
  - userConfig: 管理站点配置，可刷新标题、动画、时间轴位置等设置
`);
};

// 字段业务描述映射
const FIELD_DESCRIPTIONS = {
  timeline: {
    title: '故事标题，显示在时间轴上的主要标题',
    content: '故事正文内容，支持长文本描述',
    tags: '标签数组，用于分类和搜索故事',
    date: '故事发生的日期，用于时间轴排序',
    media: '媒体文件数组，包含图片和视频',
    isPinned: '是否置顶显示，置顶的故事会优先展示',
    isPublic: '是否公开显示，控制故事的可见性',
    createdAt: '记录创建时间，系统自动生成',
    updatedAt: '记录更新时间，系统自动维护'
  },
  userConfig: {
    siteTitle: '网站主标题，显示在页面顶部',
    siteEndText: '时间轴结尾文案，显示在时间轴底部',
    epilogueMainTitle: '结语主标题，用于页面结尾部分',
    epilogueSubTitle: '结语副标题，提供更详细的描述',
    timeAxisPosition: '时间轴位置，left(左侧) 或 right(右侧)',
    seasonalIndicator: '季节指示器开关，显示春夏秋冬标识',
    animationsEnabled: '动画效果开关，控制页面动画',
    siteMusic: '背景音乐文件名，不包含扩展名',
    createdAt: '配置创建时间，系统自动生成',
    updatedAt: '配置更新时间，系统自动维护'
  }
};

// 列出集合的所有字段
const listCollectionFields = async collectionName => {
  if (!COLLECTION_MAP[collectionName]) {
    log.error(`不支持的集合: ${collectionName}`);
    log.info(`支持的集合: ${Object.keys(COLLECTION_MAP).join(', ')}`);
    return;
  }

  const Model = COLLECTION_MAP[collectionName];
  const schema = Model.schema;
  const fields = {};

  // 遍历schema中的所有字段
  Object.keys(schema.paths).forEach(fieldName => {
    const field = schema.paths[fieldName];
    fields[fieldName] = {
      type: field.instance,
      required: field.isRequired,
      default: field.defaultValue,
      enum: field.enumValues,
      description: field.description || '',
      businessDescription: FIELD_DESCRIPTIONS[collectionName]?.[fieldName] || ''
    };
  });

  log.header(`📋 ${collectionName} 集合字段信息`);
  console.log(`总字段数: ${Object.keys(fields).length}\n`);

  Object.entries(fields).forEach(([fieldName, fieldInfo]) => {
    console.log(`${colors.cyan}${fieldName}${colors.reset}`);
    console.log(`  类型: ${fieldInfo.type}`);
    console.log(`  必填: ${fieldInfo.required ? '是' : '否'}`);
    if (fieldInfo.default !== undefined) {
      console.log(`  默认值: ${JSON.stringify(fieldInfo.default)}`);
    }
    if (fieldInfo.enum && fieldInfo.enum.length > 0) {
      console.log(`  枚举值: ${fieldInfo.enum.join(', ')}`);
    }
    if (fieldInfo.businessDescription) {
      console.log(`  业务说明: ${fieldInfo.businessDescription}`);
    }
    if (fieldInfo.description) {
      console.log(`  技术描述: ${fieldInfo.description}`);
    }
    console.log('');
  });

  // 显示业务场景说明
  if (collectionName === 'timeline') {
    console.log(`${colors.yellow}💡 Timeline集合业务场景:${colors.reset}`);
    console.log('  - 管理时间轴上的故事条目');
    console.log('  - 支持多媒体内容展示');
    console.log('  - 提供置顶和公开性控制');
    console.log('  - 支持标签分类和搜索');
    console.log('');
  } else if (collectionName === 'userConfig') {
    console.log(`${colors.yellow}💡 UserConfig集合业务场景:${colors.reset}`);
    console.log('  - 管理网站的整体配置');
    console.log('  - 控制页面显示效果');
    console.log('  - 设置用户偏好选项');
    console.log('  - 管理主题和样式');
    console.log('');
  }
};

// 验证字段是否存在
const validateField = (collectionName, fieldName) => {
  if (!COLLECTION_MAP[collectionName]) {
    throw new Error(`不支持的集合: ${collectionName}`);
  }

  const Model = COLLECTION_MAP[collectionName];
  const schemaFields = Object.keys(Model.schema.paths);

  if (!schemaFields.includes(fieldName)) {
    throw new Error(
      `集合 ${collectionName} 中不存在字段 ${fieldName}。可用字段: ${schemaFields.join(', ')}`
    );
  }

  return Model;
};

// 解析过滤条件
const parseFilter = filterStr => {
  if (!filterStr) return {};

  try {
    return JSON.parse(filterStr);
  } catch (error) {
    throw new Error(`过滤条件格式错误: ${error.message}`);
  }
};

// 获取字段的默认值
const getFieldDefaultValue = (Model, fieldName) => {
  const schemaField = Model.schema.paths[fieldName];
  return schemaField.defaultValue !== undefined
    ? schemaField.defaultValue
    : null;
};

// 刷新字段
const refreshField = async (collectionName, fieldName, value, filter = {}) => {
  try {
    log.header(`🔄 开始刷新字段: ${collectionName}.${fieldName}`);

    // 验证集合和字段
    const Model = validateField(collectionName, fieldName);

    // 解析过滤条件
    const updateFilter = parseFilter(filter);

    // 构建更新数据
    const updateData = {};
    if (value !== undefined) {
      updateData[fieldName] = value;
      log.info(`设置字段值: ${JSON.stringify(value)}`);
    } else {
      const defaultValue = getFieldDefaultValue(Model, fieldName);
      updateData[fieldName] = defaultValue;
      log.info(`重置为默认值: ${JSON.stringify(defaultValue)}`);
    }

    // 添加更新时间
    updateData.updatedAt = new Date();

    // 显示更新条件
    if (Object.keys(updateFilter).length > 0) {
      log.info(`过滤条件: ${JSON.stringify(updateFilter)}`);
    } else {
      log.info('更新所有记录');
    }

    // 执行更新
    log.info('正在执行更新...');
    const result = await Model.updateMany(updateFilter, updateData);

    // 显示结果
    log.success('字段刷新完成！');
    console.log(`\n📊 更新结果:`);
    console.log(`  匹配记录数: ${result.matchedCount}`);
    console.log(`  修改记录数: ${result.modifiedCount}`);
    console.log(`  插入记录数: ${result.upsertedCount}`);

    // 获取更新后的数据样本
    const sampleSize = Math.min(5, result.modifiedCount);
    if (sampleSize > 0) {
      const updatedItems = await Model.find(updateFilter)
        .limit(sampleSize)
        .lean();
      console.log(`\n📝 更新后的数据样本 (前${sampleSize}条):`);
      updatedItems.forEach((item, index) => {
        console.log(`  ${index + 1}. ID: ${item._id}`);
        console.log(`     ${fieldName}: ${JSON.stringify(item[fieldName])}`);
        console.log(`     updatedAt: ${item.updatedAt}`);
        console.log('');
      });
    }

    return result;
  } catch (error) {
    log.error(`字段刷新失败: ${error.message}`);
    throw error;
  }
};

// 主函数
const main = async () => {
  try {
    // 解析命令行参数
    const args = process.argv.slice(2);
    let collection = null;
    let field = null;
    let value = undefined;
    let filter = '';
    let listFields = false;

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const nextArg = args[i + 1];

      switch (arg) {
        case '-c':
        case '--collection':
          collection = nextArg;
          i++;
          break;
        case '-f':
        case '--field':
          field = nextArg;
          i++;
          break;
        case '-v':
        case '--value':
          value = parseInputValue(nextArg);
          i++;
          break;
        case '-w':
        case '--where':
          filter = nextArg;
          i++;
          break;
        case '-l':
        case '--list-fields':
          listFields = true;
          break;
        case '-h':
        case '--help':
          showHelp();
          return;
        default:
          if (arg.startsWith('-')) {
            log.error(`未知选项: ${arg}`);
            showHelp();
            return;
          }
      }
    }

    // 检查参数
    if (!collection) {
      log.error('缺少必填参数: --collection');
      showHelp();
      return;
    }

    // 连接数据库
    await connectDB();

    // 如果是列出字段
    if (listFields) {
      await listCollectionFields(collection);
      return;
    }

    // 检查其他必填参数
    if (!field) {
      log.error('缺少必填参数: --field');
      showHelp();
      return;
    }

    // 执行字段刷新
    await refreshField(collection, field, value, filter);
  } catch (error) {
    log.error(`执行失败: ${error.message}`);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
};

// 处理未捕获的异常
process.on('unhandledRejection', (reason, promise) => {
  log.error(`未处理的Promise拒绝: ${reason}`);
  process.exit(1);
});

process.on('uncaughtException', error => {
  log.error(`未捕获的异常: ${error.message}`);
  process.exit(1);
});

// 运行主函数
main();
