import express from "express";
import { config } from "dotenv";
import jsonParser from "./middleware/jsonParser.js";
import cors from "./middleware/cors.js";
import initializePassport from "./middleware/passport.js";

config();

const app = express();

//middlewares
app.use(cors);
app.use(jsonParser);
initializePassport(app);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({
        message: "Chatuu Server is running",
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
