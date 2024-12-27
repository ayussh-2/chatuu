import express from "express";
import { loginUser, createUser, googleCallback } from "../controllers/auth.js";
import passport from "passport";

const router = express.Router();

router.post("/login", loginUser);

router.post("/signup", createUser);

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/callback/google",
    passport.authenticate("google", { failureRedirect: "/" }),
    googleCallback
);

export default router;
