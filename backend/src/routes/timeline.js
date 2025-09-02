import express from 'express';
import {
  getTimelineItems,
  getPinnedItem,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem
} from '../controllers/timelineController.js';

const router = express.Router();

// GET /api/timeline/items - 获取时间轴项目列表
router.get('/items', getTimelineItems);

// GET /api/timeline/pinned - 获取置顶项目
router.get('/pinned', getPinnedItem);

// POST /api/timeline/items - 创建时间轴项目
router.post('/items', createTimelineItem);

// PUT /api/timeline/items/:id - 更新时间轴项目
router.put('/items/:id', updateTimelineItem);

// DELETE /api/timeline/items/:id - 删除时间轴项目
router.delete('/items/:id', deleteTimelineItem);

export default router;
