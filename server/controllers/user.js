import { giveError } from "../utils/utils.js";
import { config } from "dotenv";
import prisma from "../config/prisma.js";
config();

async function getUserProfile(req, res) {
    const { email } = req.body;
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

        const details = {
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        };
        res.status(200).json({
            message: "User found",
            status: "success",
            data: details,
        });
    } catch (error) {
        giveError(error, res);
    }
}

async function getUsers(req, res) {
    const { page, limit } = req.query;
    try {
        const users = await prisma.user.findMany({
            select: {
                username: true,
                email: true,
            },
            skip: (page - 1) * limit,
        });
        res.status(200).json({
            message: "Users found",
            status: "success",
            data: users,
        });
    } catch (error) {
        giveError(error, res);
    }
}

async function searchUsers(req, res) {
    const { username } = req.query;
    try {
        const users = await prisma.user.findMany({
            where: {
                username: {
                    contains: username,
                },
            },
            select: {
                username: true,
                email: true,
            },
        });
        res.status(200).json({
            message: "Users found",
            status: "success",
            data: users,
        });
    } catch (error) {
        giveError(error, res);
    }
}

async function sendFriendRequest(req, res) {
    const { friendId, selfId } = req.body;

    try {
        const userToSendReq = await prisma.user.findUnique({
            where: { id: friendId },
        });

        const user = await prisma.user.findUnique({
            where: { id: selfId },
        });

        if (!userToSendReq || !user) {
            return res.status(404).json({
                message: "User not found",
                status: "error",
            });
        }

        const existingRequest = await prisma.friendRequest.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: selfId,
                    receiverId: friendId,
                },
            },
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "Friend request already sent",
                status: "error",
            });
        }

        const friendRequest = await prisma.friendRequest.create({
            data: {
                senderId: selfId,
                receiverId: friendId,
            },
        });

        res.status(200).json({
            message: "Friend request sent",
            status: "success",
            request: friendRequest,
        });
    } catch (error) {
        giveError(error, res);
    }
}

export { getUserProfile, getUsers, searchUsers };
