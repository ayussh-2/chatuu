import express from "express";
import passport from "passport";

import {
    createUser,
    getProfileFromToken,
    googleCallback,
    loginUser,
    resetPassword,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", loginUser);

router.post("/signup", createUser);

router.post("/reset", resetPassword);

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get("/profile", getProfileFromToken);

router.get(
    "/callback/google",
    passport.authenticate("google", { failureRedirect: "/" }),
    googleCallback
);

export default router;
