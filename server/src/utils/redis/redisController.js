import redisClient from "../../config/redis.js";

class RedisController {
    static instance = null;

    static getInstance() {
        if (!RedisController.instance) {
            RedisController.instance = new RedisController();
        }
        return RedisController.instance;
    }

    async get(key) {
        try {
            const value = await redisClient.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Redis GET Error for key ${key}:`, error);
            return null;
        }
    }

    async set(key, value, expirationInSeconds = null) {
        try {
            const stringValue = JSON.stringify(value);
            if (expirationInSeconds) {
                await redisClient.setEx(key, expirationInSeconds, stringValue);
            } else {
                await redisClient.set(key, stringValue);
            }
            return true;
        } catch (error) {
            console.error(`Redis SET Error for key ${key}:`, error);
            return false;
        }
    }

    async delete(key) {
        try {
            await redisClient.del(key);
            return true;
        } catch (error) {
            console.error(`Redis DELETE Error for key ${key}:`, error);
            return false;
        }
    }

    async getOrSet(key, fetchFunction, expirationInSeconds = null) {
        try {
            const cachedValue = await this.get(key);
            if (cachedValue !== null) {
                return { data: cachedValue, cached: true };
            }

            const freshData = await fetchFunction();
            await this.set(key, freshData, expirationInSeconds);
            return { data: freshData, cached: false };
        } catch (error) {
            console.error(`Redis GET_OR_SET Error for key ${key}:`, error);
            const freshData = await fetchFunction();
            return { data: freshData, cached: false };
        }
    }

    async deletePattern(pattern) {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
            return true;
        } catch (error) {
            console.error(
                `Redis DELETE_PATTERN Error for pattern ${pattern}:`,
                error
            );
            return false;
        }
    }

    async increment(key) {
        try {
            return await redisClient.incr(key);
        } catch (error) {
            console.error(`Redis INCREMENT Error for key ${key}:`, error);
            return null;
        }
    }

    async expire(key, seconds) {
        try {
            await redisClient.expire(key, seconds);
            return true;
        } catch (error) {
            console.error(`Redis EXPIRE Error for key ${key}:`, error);
            return false;
        }
    }

    async getKeys(pattern) {
        try {
            const keys = await redisClient.keys(pattern);
            return keys;
        } catch (error) {
            console.error(
                `Redis GET_KEYS Error for pattern ${pattern}:`,
                error
            );
            return [];
        }
    }
}

export default RedisController.getInstance();
