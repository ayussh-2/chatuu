import express from "express";
import { config } from "dotenv";
import jsonParser from "./middleware/jsonParser.js";
import cors from "./middleware/cors.js";
import initializePassport from "./middleware/passport.js";
import sessionMiddleware from "./middleware/session.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import authenticateToken from "./middleware/authenticateToken.js";

//env config
config();

const app = express();

//middlewares
app.use(cors);
app.use(jsonParser);
app.use(sessionMiddleware);
initializePassport(app);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({
        message: "Chatuu Server is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", authenticateToken, userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
