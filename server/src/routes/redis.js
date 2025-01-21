import express from "express";
import redisClient from "../config/redis.js";
const router = express.Router();

router.get("/", async (req, res) => {
    await redisClient.flushAll();
    res.send("Cache cleared");
});

export default router;
