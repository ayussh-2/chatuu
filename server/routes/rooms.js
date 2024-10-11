import express from "express";
import {
    createRoom,
    getRooms,
    joinRoom,
    sendMessage,
    getMessages,
} from "../controllers/rooms.js";

const router = express.Router();

router.get("/", getRooms);
router.post("/create", createRoom);
router.post("/join", joinRoom);
router.post("/sendmessage", sendMessage);
router.post("/getmessages", getMessages);

export default router;
