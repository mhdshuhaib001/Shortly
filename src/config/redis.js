import redis from "redis";

const client = redis.createClient({
  url: process.env.REDIS_HOST,  
  retry_strategy: function(options) {
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

client.on("error", (error) => {
  console.error("Redis Error:", error);
});

client.on("connect", () => {
  console.log("Redis Connected Successfully");
});


export default client;