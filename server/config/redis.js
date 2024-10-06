import redis from "redis";
import { config } from "dotenv";

config();

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});
const redisConn = redisClient.connect();

export default redisConn;
