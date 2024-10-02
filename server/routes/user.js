import { getUserProfile } from "../controllers/user.js";
import express from "express";

const router = express.Router();

router.post("/profile", getUserProfile);

export default router;
