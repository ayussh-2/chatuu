import { config } from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import {
    authenticateToken,
    cors,
    initializePassport,
    jsonParser,
    sessionMiddleware,
} from "./middleware/middlewares.js";
import {
    authRoutes,
    roomRoutes,
    userRoutes,
    redisRoutes,
} from "./routes/routes.js";

//env config
config();

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

//middlewares
app.use(cors);
app.use(jsonParser);
app.use(sessionMiddleware);
initializePassport(app);

app.get("/", (req, res) => {
    res.json({
        message: "Chatuu Server is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", authenticateToken, userRoutes);
app.use("/api/rooms", authenticateToken, roomRoutes);
app.use("/api/redis", authenticateToken, redisRoutes);

io.on("connection", (socket) => {
    console.log("A user connected " + socket.id);

    socket.on("joinRoom", (roomId) => {
        if (socket.rooms.has(roomId)) {
            socket.emit("error", "Already joined this room");
            return;
        }
        socket.join(roomId);
        console.log("User joined room " + roomId);
        socket.emit("roomJoined", roomId);
    });

    socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
    });

    socket.on("sendMessage", ({ roomId, message, senderId }) => {
        io.to(roomId).emit("message", { senderId, message, roomId });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

export default httpServer;
