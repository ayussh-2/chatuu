import { handleRequest } from "../utils/utils.js";
import { config } from "dotenv";
import prisma from "../config/prisma.js";
config();

async function getUserProfile(req, res) {
    return handleRequest(res, async () => {
        const { userId } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return {
                statusCode: 404,
                message: "User not found",
                data: null,
            };
        }

        const details = {
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        };

        return {
            statusCode: 200,
            message: "User found",
            data: details,
        };
    });
}

async function getUsers(req, res) {
    return handleRequest(res, async () => {
        const { page, limit } = req.query;
        const users = await prisma.user.findMany({
            select: {
                username: true,
                email: true,
                id: true,
                name: true,
                createdAt: true,
                messages: {
                    select: {
                        id: true,
                    },
                },
                profilePicture: true,
                sentRequests: {
                    select: {
                        id: true,
                    },
                },
                receivedRequests: {
                    select: {
                        id: true,
                    },
                },
            },
            skip: (page - 1) * limit,
        });

        return {
            statusCode: 200,
            message: "Users found",
            data: users,
        };
    });
}

async function searchUsers(req, res) {
    return handleRequest(res, async () => {
        const { username } = req.query;
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

        return {
            statusCode: 200,
            message: "Users found",
            data: users,
        };
    });
}

async function sendFriendRequest(req, res) {
    return handleRequest(res, async () => {
        const { friendId, selfId } = req.body;
        if (friendId === selfId) {
            return {
                statusCode: 400,
                message: "Cannot send request to yourself",
                data: null,
            };
        }

        const [userToSendReq, user] = await Promise.all([
            prisma.user.findUnique({ where: { id: friendId } }),
            prisma.user.findUnique({ where: { id: selfId } }),
        ]);

        if (!userToSendReq || !user) {
            return {
                statusCode: 404,
                message: "User not found",
                data: null,
            };
        }

        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId: selfId, receiverId: friendId },
                    { senderId: friendId, receiverId: selfId },
                ],
            },
        });

        if (existingRequest) {
            if (existingRequest.status === "ACCEPTED") {
                return {
                    statusCode: 400,
                    message: "Already friends",
                    data: existingRequest,
                };
            }

            if (existingRequest.status === "PENDING") {
                if (existingRequest.senderId === selfId) {
                    return {
                        statusCode: 400,
                        message: "Friend request already sent",
                        data: existingRequest,
                    };
                } else {
                    return {
                        statusCode: 400,
                        message:
                            "You have a pending request from this user. Please respond to it instead.",
                        data: existingRequest,
                    };
                }
            }

            if (existingRequest.status === "REJECTED") {
                if (existingRequest.senderId === selfId) {
                    const friendRequest = await prisma.friendRequest.update({
                        where: { id: existingRequest.id },
                        data: {
                            status: "PENDING",
                        },
                    });
                    return {
                        statusCode: 200,
                        message: "Friend request resent",
                        data: friendRequest,
                    };
                } else {
                    return {
                        statusCode: 400,
                        message:
                            "You cannot send a request. The other user must initiate.",
                        data: existingRequest,
                    };
                }
            }
        }

        const friendRequest = await prisma.friendRequest.create({
            data: {
                senderId: selfId,
                receiverId: friendId,
                status: "PENDING",
            },
        });

        return {
            statusCode: 200,
            message: "Friend request sent",
            data: friendRequest,
        };
    });
}

async function manageFriendRequest(req, res) {
    return handleRequest(res, async () => {
        const { requestId, action } = req.body;
        if (!requestId || !action) {
            return {
                statusCode: 400,
                message: "Invalid request",
                data: null,
            };
        }

        const request = await prisma.friendRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            return {
                statusCode: 404,
                message: "Request not found",
                data: null,
            };
        }

        if (
            action !== "ACCEPTED" &&
            action !== "REJECTED" &&
            action !== "CANCELED"
        ) {
            return {
                statusCode: 400,
                message: "Invalid action",
                data: null,
            };
        }

        const requestAction = await prisma.friendRequest.update({
            where: { id: requestId },
            data: { status: action },
        });

        if (!requestAction) {
            return {
                statusCode: 400,
                message: "Action failed try again!",
                data: null,
            };
        }

        return {
            statusCode: 200,
            message: `Friend request ${action.toLowerCase()}`,
            data: null,
        };
    });
}

async function getFriendRequests(req, res) {
    return handleRequest(res, async () => {
        const { userId } = req.body;
        const requests = await prisma.friendRequest.findMany({
            where: {
                OR: [{ senderId: userId }, { receiverId: userId }],
            },
        });

        return {
            statusCode: 200,
            message: "Friend requests found",
            data: requests,
        };
    });
}

async function getFriends(req, res) {
    return handleRequest(res, async () => {
        const { userId } = req.body;
        const friends = await prisma.friendRequest.findMany({
            where: {
                OR: [
                    { senderId: userId, status: "ACCEPTED" },
                    { receiverId: userId, status: "ACCEPTED" },
                ],
            },
        });

        return {
            statusCode: 200,
            message: "Friends found",
            data: friends,
        };
    });
}

async function getRecentChats(req, res) {
    return handleRequest(res, async () => {
        const { userId } = req.body;

        if (!userId) {
            return {
                statusCode: 400,
                message: "Invalid request",
                data: null,
            };
        }

        // Get all conversations where user is a participant
        const userConversations = await prisma.participant.findMany({
            where: {
                userId: userId,
            },
            select: {
                conversation: {
                    include: {
                        participants: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        username: true,
                                        profilePicture: true,
                                    },
                                },
                            },
                        },
                        messages: {
                            orderBy: {
                                createdAt: "desc",
                            },
                            take: 20,
                            include: {
                                sender: {
                                    select: {
                                        id: true,
                                        name: true,
                                        username: true,
                                        profilePicture: true,
                                    },
                                },
                                readReceipts: {
                                    where: {
                                        userId: userId,
                                    },
                                },
                            },
                        },
                        lastMessage: {
                            include: {
                                sender: {
                                    select: {
                                        id: true,
                                        name: true,
                                        username: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const formattedChats = userConversations.map(({ conversation }) => {
            const otherParticipant = conversation.participants.find(
                (p) => p.user.id !== userId
            )?.user;

            return {
                conversationId: conversation.id,
                friend: {
                    id: otherParticipant?.id,
                    name: otherParticipant?.name,
                    username: otherParticipant?.username,
                    profilePicture: otherParticipant?.profilePicture,
                },
                lastMessage: conversation.lastMessage
                    ? {
                          id: conversation.lastMessage.id,
                          content: conversation.lastMessage.content,
                          createdAt: conversation.lastMessage.createdAt,
                          senderId: conversation.lastMessage.sender.id,
                          senderName: conversation.lastMessage.sender.name,
                      }
                    : null,
                messages: conversation.messages.map((message) => ({
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                    editedAt: message.editedAt,
                    isDeleted: message.isDeleted,
                    sender: {
                        id: message.sender.id,
                        name: message.sender.name,
                        username: message.sender.username,
                    },
                    isRead: message.readReceipts.length > 0,
                })),
                isGroup: conversation.isGroup,
                name: conversation.name,
                avatarUrl: conversation.avatarUrl,
            };
        });

        const sortedChats = formattedChats.sort((a, b) => {
            const timeA = a.lastMessage?.createdAt || 0;
            const timeB = b.lastMessage?.createdAt || 0;
            return new Date(timeB) - new Date(timeA);
        });

        return {
            statusCode: 200,
            message: "Recent chats retrieved successfully",
            data: sortedChats,
        };
    });
}

export {
    getUserProfile,
    getUsers,
    searchUsers,
    sendFriendRequest,
    manageFriendRequest,
    getFriendRequests,
    getFriends,
    getRecentChats,
};
