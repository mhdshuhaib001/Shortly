import express from 'express'
import urlController  from '../controllers/urlController.js'
const router = express.Router()
import {createURLLimiter} from '../middleware/rateLimiter.js';
import authMiddleware from '../middleware/auth.js';
import trackAnalytics from '../middleware/analytics.js';

router.post('/shorten', authMiddleware, createURLLimiter, urlController.createShortURL);
router.get('/:shortUrl',trackAnalytics,urlController.redirectToLongUrl)

export default router;
