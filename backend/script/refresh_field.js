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

示例:
  # 刷新timeline集合中所有记录的isPinned字段为false
  node refresh_field.js -c timeline -f isPinned -v false

  # 刷新userConfig集合中所有记录的siteTitle字段
  node refresh_field.js -c userConfig -f siteTitle -v "新的网站标题"

  # 只刷新特定条件的记录
  node refresh_field.js -c timeline -f isPinned -v true -w '{"tags": "重要"}'

  # 重置字段为默认值
  node refresh_field.js -c userConfig -f seasonalIndicator

  # 列出timeline集合的所有字段
  node refresh_field.js -c timeline -l

支持的集合:
  ${Object.keys(COLLECTION_MAP).join(', ')}
`);
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
      description: field.description || ''
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
    if (fieldInfo.description) {
      console.log(`  描述: ${fieldInfo.description}`);
    }
    console.log('');
  });
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
