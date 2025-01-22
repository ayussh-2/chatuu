import redis from "redis";
import { config } from "dotenv";

config();

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    retry_strategy: (options) => {
        if (options.error && options.error.code === "ECONNREFUSED") {
            console.error("The server refused the connection");
            return new Error("The server refused the connection");
        }
        if (options.total_retry_time > 1000 * 60 * 5) {
            console.error("Retry time exhausted");
            return new Error("Retry time exhausted");
        }
        if (options.attempt > 10) {
            console.error("Too many connection attempts");
            return undefined;
        }

        return Math.min(options.attempt * 100, 3000);
    },
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

redisClient.on("connect", () => {
    console.log("Redis client connected");
});

redisClient.on("reconnecting", () => {
    console.log("Reconnecting to Redis...");
});

redisClient.on("end", () => {
    console.log("Redis connection closed");
});

async function connectRedis() {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error("Failed to connect to Redis:", err);
    }
}

connectRedis();

export default redisClient;
