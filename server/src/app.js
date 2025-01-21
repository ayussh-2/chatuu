import { config } from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cron from "node-cron";
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

import ChatHandler from "./utils/redis/chatHandler.js";

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

const chatHandler = new ChatHandler(io);

// cron job to save msg buffers
cron.schedule("*/1 * * * *", () => {
    // console.log("Saving all buffers to database");
    chatHandler.saveAllBuffers();
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

export default httpServer;
