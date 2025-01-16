import {
    getUserProfile,
    getUsers,
    searchUsers,
    manageFriendRequest,
    sendFriendRequest,
    getFriends,
    getFriendRequests,
    getRecentChats,
    getNonFriends,
} from "../controllers/user.js";
import express from "express";

const router = express.Router();

router.post("/profile", getUserProfile);
router.get("/users", getUsers);
router.get("/search", searchUsers);
router.post("/send-request", sendFriendRequest);
router.post("/manage-requests", manageFriendRequest);
router.post("/friends", getFriends);
router.post("/requests", getFriendRequests);
router.post("/chats", getRecentChats);
router.post("/non-friends", getNonFriends);
export default router;
