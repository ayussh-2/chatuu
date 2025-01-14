import bcrypt from "bcryptjs";
import { config } from "dotenv";

import prisma from "../config/prisma.js";
import redisClient from "../config/redis.js";
import { generateToken, handleRequest } from "../utils/utils.js";

config();

async function createUser(req, res) {
    return handleRequest(res, async () => {
        const { email, password, username, name } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });

        if (existingUser) {
            return {
                statusCode: 200,
                message: "Email already in use",
                data: null,
            };
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

        return {
            statusCode: 201,
            message: "User created successfully",
            data: {
                userId: newUser.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
                token: generateToken({ email, password }),
            },
        };
    });
}

async function loginUser(req, res) {
    return handleRequest(res, async () => {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return {
                statusCode: 401,
                message: "User Not Found",
                data: null,
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return {
                statusCode: 401,
                message: "Incorrect password",
                data: null,
            };
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

        return {
            statusCode: 200,
            message: "User logged in successfully",
            data: {
                userId: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                token,
            },
        };
    });
}

async function loginGoogleUser(email, res) {
    return handleRequest(res, async () => {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return {
                statusCode: 401,
                message: "User Not Found",
                data: null,
            };
        }
        const token = generateToken(user);
        return {
            redirect:
                process.env.CLIENT_URL + "/api/googleLogin?token=" + token,
        };
    });
}

async function googleCallback(req, res) {
    return handleRequest(res, async () => {
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
                return {
                    redirect:
                        process.env.CLIENT_URL +
                        "/api/googleLogin?token=" +
                        token,
                };
            }
        } else {
            const userLogin = await loginGoogleUser(email, res);
            return userLogin;
        }
    });
}

async function resetPassword(req, res) {
    handleRequest(res, async () => {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return {
                statusCode: 401,
                message: "User Not Found",
                data: null,
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                password: hashedPassword,
            },
        });

        return {
            statusCode: 200,
            message: "Password reset successfully",
            data: null,
        };
    });
}

export { createUser, googleCallback, loginUser, resetPassword };
