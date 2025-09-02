import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    aspectRatio: {
      type: String,
      default: '16/9',
      trim: true
    }
  },
  { _id: false }
);

const timelineItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 20
      }
    ],
    date: {
      type: Date,
      required: true
    },
    media: [mediaSchema],
    isPinned: {
      type: Boolean,
      default: false
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
timelineItemSchema.index({ date: -1 });
timelineItemSchema.index({ isPinned: 1 });
timelineItemSchema.index({ tags: 1 });
timelineItemSchema.index({ createdAt: -1 });

// 中间件
timelineItemSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const TimelineItem = mongoose.model('TimelineItem', timelineItemSchema);

export default TimelineItem;
