import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from '../config/redis.js';

const createRateLimiter = (windowMs, max) => {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redis.sendCommand(args),
      prefix: 'rate-limit',
    }),
    windowMs,
    max,
    message: {
      error: 'Too many requests, Please try again later',
    },
  });
};

export const createURLLimiter = createRateLimiter(10 * 1000, 5); 
export const createAnalyticsLimiter = createRateLimiter(5 * 1000, 3); 
