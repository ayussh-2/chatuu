import { getUserProfile, getUsers, searchUsers } from "../controllers/user.js";
import express from "express";

const router = express.Router();

router.post("/profile", getUserProfile);
router.get("/users", getUsers);
router.get("/search", searchUsers);

export default router;
