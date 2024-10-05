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

const io = new Server(httpServer);

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
    authenticateToken,
    roomRoutes
);

// Socket.IO connection handler
io.on("connection", (socket) => {
    console.log("A user connected");

    // Add your socket event handlers here

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
