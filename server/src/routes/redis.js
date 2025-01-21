import express from "express";
import redisClient from "../config/redis.js";
const router = express.Router();

router.get("/", async (req, res) => {
    await redisClient.flushAll();
    res.json({ message: "Cache cleared" });
});

export default router;
