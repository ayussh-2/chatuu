import express from "express";
import { config } from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import {
    cors,
    authenticateToken,
    initializePassport,
    jsonParser,
    sessionMiddleware,
} from "./middleware/middlewares.js";
import { authRoutes, roomRoutes, userRoutes } from "./routes/routes.js";

//env config
config();

const app = express();
const httpServer = createServer(app);

//middlewares
app.use(cors);
app.use(jsonParser);
app.use(sessionMiddleware);
initializePassport(app);

export const io = new Server(httpServer);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({
        message: "Chatuu Server is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", authenticateToken, userRoutes);
app.use(
    "/api/rooms",
    (req, res, next) => {
        req.io = io;
        next();
    },

    roomRoutes
);

io.on("connection", (socket) => {
    console.log("A user connected " + socket.id);

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on("sendMessage", ({ roomId, message }) => {
        io.to(roomId).emit("message", { userId: socket.id, message });
        console.log(`User ${socket.id} sent message to room ${roomId}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
