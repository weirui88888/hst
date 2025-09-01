import TimelineItem from '../models/TimelineItem.js';

// 获取时间轴项目列表
export const getTimelineItems = async (req, res) => {
  try {
    const items = await TimelineItem.find()
      .sort({ date: -1, createdAt: -1 })
      .lean();

    // 转换为API格式
    const formattedItems = items.map(item => ({
      id: item._id.toString(),
      title: item.title,
      content: item.content,
      tags: item.tags || [],
      date: item.date,
      media: item.media || [],
      isPinned: item.isPinned || false
    }));

    res.json({
      items: formattedItems
    });
  } catch (error) {
    console.error('获取时间轴项目失败:', error);
    res.status(500).json({
      error: '获取时间轴项目失败',
      message: error.message
    });
  }
};

// 获取置顶项目
export const getPinnedItem = async (req, res) => {
  try {
    const pinnedItem = await TimelineItem.findOne({ isPinned: true })
      .sort({ createdAt: -1 })
      .lean();

    if (!pinnedItem) {
      return res.json({
        pinnedId: null
      });
    }

    res.json({
      pinnedId: pinnedItem._id.toString()
    });
  } catch (error) {
    console.error('获取置顶项目失败:', error);
    res.status(500).json({
      error: '获取置顶项目失败',
      message: error.message
    });
  }
};

// 创建时间轴项目
export const createTimelineItem = async (req, res) => {
  try {
    const { title, content, tags, date, media, isPinned } = req.body;

    // 验证必填字段
    if (!title || !content || !date) {
      return res.status(400).json({
        error: '缺少必填字段',
        message: 'title、content 和 date 为必填字段'
      });
    }

    // 验证并转换日期
    let dateObj;
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      // 尝试解析日期字符串
      dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          error: '无效的日期格式',
          message: '无法解析日期字符串'
        });
      }
    } else {
      return res.status(400).json({
        error: '无效的日期格式',
        message: '日期必须是Date对象或有效的日期字符串'
      });
    }

    // 如果设置为置顶，先取消其他置顶项目
    if (isPinned) {
      await TimelineItem.updateMany(
        { isPinned: true },
        { isPinned: false }
      );
    }

    const timelineItem = new TimelineItem({
      title,
      content,
      tags: tags || [],
      date: dateObj,
      media: media || [],
      isPinned: isPinned || false
    });

    await timelineItem.save();

    res.status(201).json({
      message: '时间轴项目创建成功',
      item: {
        id: timelineItem._id.toString(),
        title: timelineItem.title,
        content: timelineItem.content,
        tags: timelineItem.tags,
        date: timelineItem.date,
        media: timelineItem.media,
        isPinned: timelineItem.isPinned
      }
    });
  } catch (error) {
    console.error('创建时间轴项目失败:', error);
    res.status(500).json({
      error: '创建时间轴项目失败',
      message: error.message
    });
  }
};

// 更新时间轴项目
export const updateTimelineItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, date, media, isPinned } = req.body;

    const timelineItem = await TimelineItem.findById(id);
    if (!timelineItem) {
      return res.status(404).json({
        error: '项目不存在',
        message: '找不到指定的时间轴项目'
      });
    }

    // 如果设置为置顶，先取消其他置顶项目
    if (isPinned && !timelineItem.isPinned) {
      await TimelineItem.updateMany(
        { isPinned: true },
        { isPinned: false }
      );
    }

    // 更新字段
    if (title !== undefined) timelineItem.title = title;
    if (content !== undefined) timelineItem.content = content;
    if (tags !== undefined) timelineItem.tags = tags;
    if (date !== undefined) {
      // 验证并转换日期
      let dateObj;
      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'string') {
        dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          return res.status(400).json({
            error: '无效的日期格式',
            message: '无法解析日期字符串'
          });
        }
      } else {
        return res.status(400).json({
          error: '无效的日期格式',
          message: '日期必须是Date对象或有效的日期字符串'
        });
      }
      timelineItem.date = dateObj;
    }
    if (media !== undefined) timelineItem.media = media;
    if (isPinned !== undefined) timelineItem.isPinned = isPinned;

    await timelineItem.save();

    res.json({
      message: '时间轴项目更新成功',
      item: {
        id: timelineItem._id.toString(),
        title: timelineItem.title,
        content: timelineItem.content,
        tags: timelineItem.tags,
        date: timelineItem.date,
        media: timelineItem.media,
        isPinned: timelineItem.isPinned
      }
    });
  } catch (error) {
    console.error('更新时间轴项目失败:', error);
    res.status(500).json({
      error: '更新时间轴项目失败',
      message: error.message
    });
  }
};

// 删除时间轴项目
export const deleteTimelineItem = async (req, res) => {
  try {
    const { id } = req.params;

    const timelineItem = await TimelineItem.findByIdAndDelete(id);
    if (!timelineItem) {
      return res.status(404).json({
        error: '项目不存在',
        message: '找不到指定的时间轴项目'
      });
    }

    res.json({
      message: '时间轴项目删除成功'
    });
  } catch (error) {
    console.error('删除时间轴项目失败:', error);
    res.status(500).json({
      error: '删除时间轴项目失败',
      message: error.message
    });
  }
};

