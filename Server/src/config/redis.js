import redis from "redis";
import dotenv from 'dotenv'
dotenv.config()

console.log('Attempting to connect to Redis with URL:', "redis://redis:6379");

const client = redis.createClient({
  url: process.env.REDIS_HOST,
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Reconnection attempt ${retries}`);
      if (retries > 7) {
        console.log('Max reconnection attempts reached');
        return false;       }
      return Math.min(retries * 100, 3000);
    }
  }
});

client.on("error", (error) => {
  console.error("Redis Error (detailed):", {
    message: error.message,
    code: error.code,
    details: error
  });
});

client.on("connect", () => {
  console.log("Redis Connected Successfully");
});

client.on("ready", () => {
  console.log("Redis Client Ready");
});

try {
  console.log('Starting Redis connection...');
  await client.connect();
  console.log('Redis connection established');
} catch (error) {
  console.error('Failed to connect to Redis:', error);
}

console.log('-------------');

export default client;