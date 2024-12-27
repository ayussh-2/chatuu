import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import { giveError, generateToken } from "../utils/utils.js";
import { config } from "dotenv";
import redisClient from "../config/redis.js";

config();

async function createUser(req, res) {
    const { email, password, username, name } = req.body;
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
                name,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            message: "User created successfully",
            status: "success",
            user: {
                userId: newUser.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
            },
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
        (await redisClient).set(
            token,
            JSON.stringify({
                email: user.email,
                isOnline: true,
                lastSeen: new Date(),
            })
        );
        res.status(200).json({
            message: "User logged in successfully",
            status: "success",
            token,
            user: {
                userId: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
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
            const trimmedEmailUsername = email.split("@")[0];
            const createdUser = await prisma.user.create({
                data: {
                    email,
                    name: displayName,
                    username: trimmedEmailUsername,
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
