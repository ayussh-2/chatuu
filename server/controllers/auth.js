import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import { giveError, generateToken } from "../utils/utils.js";
import { config } from "dotenv";
import redisConn from "../config/redis.js";

config();

async function createUser(req, res) {
    const { email, password, username } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });

        if (existingUser) {
            return res.status(200).json({
                message: "Email already in use",
                status: "error",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            message: "User created successfully",
            status: "success",
            user: { username: newUser.username, email: newUser.email },
            token: generateToken({ email, password }),
        });
    } catch (err) {
        giveError(err, res);
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(401).json({
                message: "User Not Found",
                status: "error",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "User Not Found",
                status: "error",
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: "User logged in successfully",
            status: "success",
            token,
            user: { username: user.username, email: user.email },
        });
    } catch (err) {
        giveError(err, res);
    }
}

async function loginGoogleUser(email, res) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(401).json({
                message: "User Not Found",
                status: "error",
            });
        }
        const token = generateToken(user);
        res.redirect(
            process.env.CLIENT_URL + "/api/googleLogin?token=" + token
        );
    } catch (err) {
        giveError(err, res);
    }
}

async function googleCallback(req, res) {
    try {
        const { email, displayName } = req.user;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (!existingUser) {
            const password = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(password, 10);
            const createdUser = await prisma.user.create({
                data: {
                    email,
                    username: displayName,
                    password: hashedPassword,
                },
            });
            if (createdUser) {
                const token = generateToken(createdUser);
                return res.redirect(
                    process.env.CLIENT_URL + "/api/googleLogin?token=" + token
                );
            }
        } else {
            const userLogin = await loginGoogleUser(email, res);
            return userLogin;
        }
    } catch (error) {
        giveError(error, res);
    }
}

export { createUser, loginUser, googleCallback };
