import mongoose from 'mongoose';

const userConfigSchema = new mongoose.Schema(
  {
    siteTitle: {
      type: String,
      required: true,
      default: '多多与贺贺的青春',
      trim: true,
      maxlength: 100
    },
    siteEndText: {
      type: String,
      required: true,
      default: '十二年的陪伴，是最长情的告白',
      trim: true,
      maxlength: 200
    },
    epilogueMainTitle: {
      type: String,
      required: true,
      default: '流转的岁月里，爱从未缺席',
      trim: true,
      maxlength: 100
    },
    epilogueSubTitle: {
      type: String,
      required: true,
      default: '多多与贺贺的旅程，注定漫长而璀璨，也注定写满温柔与期待 !',
      trim: true,
      maxlength: 300
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
  },
  {
    timestamps: true
  }
);

// 索引
userConfigSchema.index({ createdAt: -1 });

// 中间件
userConfigSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const UserConfig = mongoose.model('UserConfig', userConfigSchema);

export default UserConfig;
