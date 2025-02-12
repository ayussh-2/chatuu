import bcrypt from "bcryptjs";
import { config } from "dotenv";

import prisma from "../config/prisma.js";
import { generateToken, handleRequest, decodeToken } from "../utils/utils.js";
import {
    CacheInvalidator,
    INVALIDATION_EVENTS,
} from "../utils/redis/cacheInValidator.js";

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

        await CacheInvalidator.invalidateByEvent(
            INVALIDATION_EVENTS.USER_LIST_UPDATED,
            {
                pattern: "users:*",
            }
        );

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

async function processGoogleLogin(email) {
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
        redirect: process.env.CLIENT_URL + "/api/googleLogin?token=" + token,
    };
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
        }

        return await processGoogleLogin(email);
    });
}

async function resetPassword(req, res) {
    handleRequest(res, async () => {
        const { password } = req.body;

        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return {
                statusCode: 400,
                message: "Invalid token",
                data: null,
            };
        }

        const userToken = decodeToken(token);
        const email = userToken.email;

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

async function getProfileFromToken(req, res) {
    return handleRequest(res, async () => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                statusCode: 400,
                message: "Authorization header is missing or malformed",
                data: null,
            };
        }
        const token = authHeader.split(" ")[1];

        const user = decodeToken(token);
        if (!user) {
            return {
                statusCode: 400,
                message: "Invalid token",
                data: null,
            };
        }

        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                profilePicture: true,
            },
        });
        return {
            statusCode: 200,
            message: "User found",
            data: {
                userId: userData.id,
                name: userData.name,
                username: userData.username,
                email: userData.email,
                profilePicture: userData.profilePicture,
            },
        };
    });
}

export {
    createUser,
    googleCallback,
    loginUser,
    resetPassword,
    getProfileFromToken,
};
