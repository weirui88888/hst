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

// 分析集合结构
const analyzeCollection = async (collectionName, Model) => {
  log.header(`📊 分析集合: ${collectionName}`);

  // 获取Schema信息
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
      maxlength: field.maxlength,
      minlength: field.minlength,
      min: field.min,
      max: field.max,
      validate: field.validators?.map(v => v.message) || []
    };
  });

  // 获取实际数据统计
  const totalCount = await Model.countDocuments();
  const sampleData = await Model.find().limit(3).lean();

  console.log(`\n📈 数据统计:`);
  console.log(`  总记录数: ${totalCount}`);
  console.log(`  字段数量: ${Object.keys(fields).length}`);

  if (totalCount > 0) {
    console.log(`\n📝 字段详情:`);
    Object.entries(fields).forEach(([fieldName, fieldInfo]) => {
      console.log(`\n${colors.cyan}${fieldName}${colors.reset}`);
      console.log(`  类型: ${fieldInfo.type}`);
      console.log(`  必填: ${fieldInfo.required ? '是' : '否'}`);

      if (fieldInfo.default !== undefined) {
        console.log(`  默认值: ${JSON.stringify(fieldInfo.default)}`);
      }

      if (fieldInfo.enum && fieldInfo.enum.length > 0) {
        console.log(`  枚举值: ${fieldInfo.enum.join(', ')}`);
      }

      if (fieldInfo.maxlength) {
        console.log(`  最大长度: ${fieldInfo.maxlength}`);
      }

      if (fieldInfo.minlength) {
        console.log(`  最小长度: ${fieldInfo.minlength}`);
      }

      if (fieldInfo.min !== undefined) {
        console.log(`  最小值: ${fieldInfo.min}`);
      }

      if (fieldInfo.max !== undefined) {
        console.log(`  最大值: ${fieldInfo.max}`);
      }

      if (fieldInfo.validate.length > 0) {
        console.log(`  验证规则: ${fieldInfo.validate.join(', ')}`);
      }

      if (fieldInfo.description) {
        console.log(`  描述: ${fieldInfo.description}`);
      }
    });

    console.log(`\n📋 数据样本 (前3条):`);
    sampleData.forEach((item, index) => {
      console.log(`\n${colors.yellow}样本 ${index + 1}:${colors.reset}`);
      Object.entries(item).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          console.log(
            `  ${key}: ${JSON.stringify(value, null, 2).replace(/\n/g, '\n    ')}`
          );
        } else {
          console.log(`  ${key}: ${value}`);
        }
      });
    });
  } else {
    console.log(`\n⚠️  集合为空，无数据样本`);
  }

  return {
    collectionName,
    totalCount,
    fields,
    sampleData
  };
};

// 生成脚本示例
const generateScriptExamples = analysisResults => {
  log.header('📝 生成脚本使用示例');

  analysisResults.forEach(result => {
    const { collectionName, fields, sampleData } = result;

    console.log(
      `\n${colors.magenta}=== ${collectionName.toUpperCase()} 集合示例 ===${colors.reset}`
    );

    // 生成add_field示例
    console.log(`\n${colors.green}➕ add_field.js 示例:${colors.reset}`);
    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      if (
        fieldName === '_id' ||
        fieldName === 'createdAt' ||
        fieldName === 'updatedAt'
      )
        return;

      let exampleValue = '';
      const type = field.type;

      // 根据字段类型生成示例值
      switch (type) {
        case 'String':
          if (field.enum && field.enum.length > 0) {
            exampleValue = `"${field.enum[0]}"`;
          } else if (field.default !== undefined) {
            exampleValue = `"${field.default}"`;
          } else {
            exampleValue = '"示例值"';
          }
          break;
        case 'Boolean':
          exampleValue =
            field.default !== undefined ? field.default.toString() : 'true';
          break;
        case 'Number':
          exampleValue =
            field.default !== undefined ? field.default.toString() : '0';
          break;
        case 'Array':
          exampleValue = '["示例1", "示例2"]';
          break;
        case 'Object':
          exampleValue = '{"key": "value"}';
          break;
        case 'Date':
          exampleValue = '"2024-01-01"';
          break;
        default:
          exampleValue = '"示例值"';
      }

      console.log(`  # 添加${fieldName}字段`);
      console.log(
        `  node add_field.js -c ${collectionName} -f ${fieldName} -v ${exampleValue} -t ${type.toLowerCase()}`
      );
    });

    // 生成refresh_field示例
    console.log(`\n${colors.green}🔄 refresh_field.js 示例:${colors.reset}`);
    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      if (
        fieldName === '_id' ||
        fieldName === 'createdAt' ||
        fieldName === 'updatedAt'
      )
        return;

      let exampleValue = '';

      // 根据字段类型生成示例值
      switch (field.type) {
        case 'String':
          if (field.enum && field.enum.length > 0) {
            exampleValue = `"${field.enum[0]}"`;
          } else if (field.default !== undefined) {
            exampleValue = `"${field.default}"`;
          } else {
            exampleValue = '"新值"';
          }
          break;
        case 'Boolean':
          exampleValue =
            field.default !== undefined ? (!field.default).toString() : 'false';
          break;
        case 'Number':
          exampleValue =
            field.default !== undefined ? (field.default + 1).toString() : '1';
          break;
        case 'Array':
          exampleValue = '["新标签1", "新标签2"]';
          break;
        case 'Object':
          exampleValue = '{"newKey": "newValue"}';
          break;
        case 'Date':
          exampleValue = '"2024-12-31"';
          break;
        default:
          exampleValue = '"新值"';
      }

      console.log(`  # 刷新${fieldName}字段`);
      console.log(
        `  node refresh_field.js -c ${collectionName} -f ${fieldName} -v ${exampleValue}`
      );
    });

    // 生成条件查询示例
    if (sampleData.length > 0) {
      console.log(`\n${colors.green}🔍 条件查询示例:${colors.reset}`);
      const sample = sampleData[0];
      Object.keys(sample).forEach(key => {
        if (key === '_id' || key === 'createdAt' || key === 'updatedAt') return;

        const value = sample[key];
        let filterValue = '';

        if (typeof value === 'string') {
          filterValue = `"${value}"`;
        } else if (typeof value === 'boolean') {
          filterValue = value.toString();
        } else if (typeof value === 'number') {
          filterValue = value.toString();
        } else if (Array.isArray(value)) {
          filterValue = `["${value[0] || '示例'}"]`;
        } else if (typeof value === 'object' && value !== null) {
          filterValue = '{"key": "value"}';
        } else {
          filterValue = `"${value}"`;
        }

        console.log(`  # 根据${key}条件操作`);
        console.log(
          `  node add_field.js -c ${collectionName} -f newField -v "值" -w '{"${key}": ${filterValue}}'`
        );
      });
    }
  });
};

// 显示帮助信息
const showHelp = () => {
  log.header('🔍 数据库结构分析脚本');
  console.log(`
用法: node analyze_db_structure.js [选项]

选项:
  -c, --collection <name>    指定要分析的集合名称 (timeline, userConfig, all)
  -e, --examples             生成脚本使用示例
  -h, --help                 显示帮助信息

示例:
  # 分析所有集合
  node analyze_db_structure.js

  # 分析特定集合
  node analyze_db_structure.js -c timeline

  # 分析并生成示例
  node analyze_db_structure.js -e

  # 分析特定集合并生成示例
  node analyze_db_structure.js -c userConfig -e

支持的集合:
  ${Object.keys(COLLECTION_MAP).join(', ')}
`);
};

// 主函数
const main = async () => {
  try {
    // 解析命令行参数
    const args = process.argv.slice(2);
    let targetCollection = 'all';
    let generateExamples = false;

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const nextArg = args[i + 1];

      switch (arg) {
        case '-c':
        case '--collection':
          targetCollection = nextArg;
          i++;
          break;
        case '-e':
        case '--examples':
          generateExamples = true;
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

    // 连接数据库
    await connectDB();

    const analysisResults = [];

    if (targetCollection === 'all') {
      // 分析所有集合
      for (const [name, Model] of Object.entries(COLLECTION_MAP)) {
        const result = await analyzeCollection(name, Model);
        analysisResults.push(result);
      }
    } else {
      // 分析指定集合
      if (!COLLECTION_MAP[targetCollection]) {
        log.error(`不支持的集合: ${targetCollection}`);
        log.info(`支持的集合: ${Object.keys(COLLECTION_MAP).join(', ')}`);
        return;
      }

      const result = await analyzeCollection(
        targetCollection,
        COLLECTION_MAP[targetCollection]
      );
      analysisResults.push(result);
    }

    // 生成示例
    if (generateExamples) {
      generateScriptExamples(analysisResults);
    }

    log.success('数据库结构分析完成！');
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
