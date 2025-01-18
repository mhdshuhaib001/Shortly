import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from '../config/redis.js';

const createRateLimiter = (duration, points) => {
  const rateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'rate-limit',
    points, 
    duration: duration / 1000, 
  });

  return async (req, res, next) => {
    try {
      const key = req.ip;
      await rateLimiter.consume(key);
      next();
    } catch (error) {
      res.status(429).json({
        error: 'Too many requests, Please try again later'
      });
    }
  };
};

export const createURLLimiter = createRateLimiter(10 * 1000, 5);  
export const createAnalyticsLimiter = createRateLimiter(5 * 1000, 3);  