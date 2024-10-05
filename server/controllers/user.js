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

    // Check if the user is trying to send a request to themselves
    if (friendId === selfId) {
        return res.status(400).json({
            message: "Cannot send request to yourself",
            status: "error",
        });
    }

    try {
        // Fetch both users in parallel
        const [userToSendReq, user] = await Promise.all([
            prisma.user.findUnique({ where: { id: friendId } }),
            prisma.user.findUnique({ where: { id: selfId } }),
        ]);

        // Check if both users exist
        if (!userToSendReq || !user) {
            return res.status(404).json({
                message: "User not found",
                status: "error",
            });
        }

        // Check for existing friend request
        const existingRequest = await prisma.friendRequest.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: selfId,
                    receiverId: friendId,
                },
            },
        });

        // Handle existing request statuses
        if (existingRequest) {
            switch (existingRequest.status) {
                case "PENDING":
                    return res.status(400).json({
                        message: "Friend request already sent",
                        status: "error",
                        existingRequest,
                    });
                case "ACCEPTED":
                    return res.status(400).json({
                        message: "Already friends",
                        status: "error",
                        existingRequest,
                    });
                case "REJECTED":
                    const friendRequest = await prisma.friendRequest.update({
                        where: { id: existingRequest.id },
                        data: {
                            status: "PENDING",
                        },
                    });
                    return res.status(200).json({
                        message: "Friend request resent",
                        status: "success",
                        request: friendRequest,
                    });
            }
        }

        // Create a new friend request
        const friendRequest = await prisma.friendRequest.create({
            data: {
                senderId: selfId,
                receiverId: friendId,
                status: "PENDING",
            },
        });

        return res.status(200).json({
            message: "Friend request sent",
            status: "success",
            request: friendRequest,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            status: "error",
            error: error.message,
        });
    }
}

async function manageFriendRequest(req, res) {
    const { requestId, action } = req.body;
    try {
        if (!requestId || !action) {
            return res.status(400).json({
                message: "Invalid request",
                status: "error",
            });
        }

        const request = await prisma.friendRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            return res.status(404).json({
                message: "Request not found",
                status: "error",
            });
        }

        if (
            action !== "ACCEPTED" &&
            action !== "REJECTED" &&
            action !== "CANCELED"
        ) {
            return res.status(400).json({
                message: "Invalid action",
                status: "error",
            });
        }

        const requestAction = await prisma.friendRequest.update({
            where: { id: requestId },
            data: { status: action },
        });

        console.log(requestAction);

        if (!requestAction) {
            return res.status(400).json({
                message: "Action failed try again!",
                status: "error",
            });
        }

        return res.status(200).json({
            message: "Friend request " + action.toLowerCase(),
            status: "success",
        });
    } catch (error) {
        giveError(error, res);
    }
}

async function getFriendRequests(req, res) {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User not found",
                status: "error",
            });
        }

        const requests = await prisma.friendRequest.findMany({
            where: {
                OR: [{ senderId: userId }, { receiverId: userId }],
            },
        });

        return res.status(200).json({
            message: "Friend requests found",
            status: "success",
            data: requests,
        });
    } catch (error) {
        giveError(error, res);
    }
}

async function getFriends(req, res) {
    try {
        const { userId } = req.body;
        const friends = await prisma.friendRequest.findMany({
            where: {
                OR: [
                    { senderId: userId, status: "ACCEPTED" },
                    { receiverId: userId, status: "ACCEPTED" },
                ],
            },
            include: {
                sender: true,
                receiver: true,
            },
        });
        return res.status(200).json({
            message: "Friends found",
            status: "success",
            data: friends,
        });
    } catch (error) {
        giveError(error, res);
    }
}

export {
    getUserProfile,
    getUsers,
    searchUsers,
    sendFriendRequest,
    manageFriendRequest,
    getFriendRequests,
    getFriends,
};
