import session from "express-session";
import { config } from "dotenv";

config();

const sessionMiddleware = session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
});

export default sessionMiddleware;
