import  express  from "express";
import analyticsController from '../controllers/analyticsController.js';
import authMiddleware from "../middleware/auth.js";
import { createAnalyticsLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get('/url/:urlId',authMiddleware,createAnalyticsLimiter,analyticsController.getURLAnalytics)
router.get('/topic/:topic',authMiddleware,createAnalyticsLimiter,analyticsController.getTopicAnalytics)

export default router
