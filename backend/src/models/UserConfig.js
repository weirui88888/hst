import mongoose from 'mongoose';

const userConfigSchema = new mongoose.Schema({
  siteTitle: {
    type: String,
    required: true,
    default: '我的故事',
    trim: true,
    maxlength: 100
  },
  siteEndText: {
    type: String,
    required: true,
    default: '— 已到时间轴结尾 —',
    trim: true,
    maxlength: 200
  },
  timeAxisPosition: {
    type: String,
    enum: ['left', 'right'],
    default: 'right'
  },
  seasonalIndicator: {
    type: Boolean,
    default: false
  },
  animationsEnabled: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 索引
userConfigSchema.index({ createdAt: -1 });

// 中间件
userConfigSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const UserConfig = mongoose.model('UserConfig', userConfigSchema);

export default UserConfig;

