import express from 'express';
import {
  getUserConfig,
  updateUserConfig
} from '../controllers/userConfigController.js';

const router = express.Router();

// GET /api/user/config - 获取用户配置
router.get('/config', getUserConfig);

// POST /api/user/config - 更新用户配置
router.post('/config', updateUserConfig);

export default router;
