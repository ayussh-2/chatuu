import { config } from "dotenv";

import prisma from "../config/prisma.js";
import {
    handleRequest,
    generateRandomChars,
    formatTime,
    decodeToken,
} from "../utils/utils.js";
import { createRoomHandler } from "./rooms.js";
import redisController from "../utils/redis/redisController.js";
import {
    CacheInvalidator,
    INVALIDATION_EVENTS,
} from "../utils/redis/cacheInValidator.js";

config();

const CACHE_EXPIRATION = process.env.CACHE_EXPIRATION || 300;

async function getUserProfile(req, res) {
    return handleRequest(res, async () => {
        const { userId } = req.body;
        const cacheKey = `user_profile:${userId}`;
        const { data: details, cached } = await redisController.getOrSet(
            cacheKey,
            async () => {
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
                    name: user.name,
                    id: user.id,
                };

                return details;
            },
            CACHE_EXPIRATION
        );
        return {
            statusCode: 200,
            message: cached
                ? "Profile retrieved from cache"
                : "Profile retrieved",
            data: details,
        };
    });
}

async function getUsers(req, res) {
    return handleRequest(res, async () => {
        const { page = 1, limit = 0 } = req.query;
        const cacheKey = `users:${page}:${limit}`;

        const { data: users, cached } = await redisController.getOrSet(
            cacheKey,
            async () => {
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

                return users;
            },
            CACHE_EXPIRATION
        );

        return {
            statusCode: 200,
            message: cached ? "Users retrieved from cache" : "Users retrieved",
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

            if (
                existingRequest.status === "REJECTED" ||
                existingRequest.status === "CANCELED"
            ) {
                if (existingRequest.senderId === selfId) {
                    const friendRequest = await prisma.friendRequest.update({
                        where: { id: existingRequest.id },
                        data: {
                            status: "PENDING",
                        },
                    });

                    await CacheInvalidator.invalidateByEvent(
                        INVALIDATION_EVENTS.FRIEND_REQUEST_SENT,
                        {
                            senderId: selfId,
                            receiverId: friendId,
                        }
                    );

                    return {
                        statusCode: 200,
                        message: "Friend request resent",
                        data: friendRequest,
                    };
                } else {
                    const friendRequest = await prisma.friendRequest.update({
                        where: { id: existingRequest.id },
                        data: {
                            status: "PENDING",
                            senderId: selfId,
                            receiverId: friendId,
                        },
                    });

                    await CacheInvalidator.invalidateByEvent(
                        INVALIDATION_EVENTS.FRIEND_REQUEST_SENT,
                        {
                            senderId: selfId,
                            receiverId: friendId,
                        }
                    );
                    return {
                        statusCode: 200,
                        message: "Friend request sent",
                        data: friendRequest,
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

        await CacheInvalidator.invalidateByEvent(
            INVALIDATION_EVENTS.FRIEND_REQUEST_SENT,
            {
                senderId: selfId,
                receiverId: friendId,
            }
        );

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
                data: "Missing requestId or action",
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

        await CacheInvalidator.invalidateByEvent(
            INVALIDATION_EVENTS.FRIEND_REQUEST_RESPONDED,
            {
                senderId: requestAction.senderId,
                receiverId: requestAction.receiverId,
            }
        );

        if (action === "ACCEPTED") {
            const userIds = [requestAction.senderId, requestAction.receiverId];
            const roomName = generateRandomChars();
            const roomStatus = createRoomHandler(roomName, userIds);

            await CacheInvalidator.invalidateByEvent(
                INVALIDATION_EVENTS.RECENT_CHATS_UPDATED,
                {
                    userIds,
                }
            );

            return {
                statusCode: 200,
                message: "Friend request accepted",
                data: roomStatus,
            };
        }

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
        const token = req.headers.authorization.split(" ")[1];
        const userToken = decodeToken(token);
        if (!userToken.id) {
            return {
                statusCode: 403,
                message: "Unauthorized",
                data: null,
            };
        }

        const userId = userToken.id;

        const cacheKey = `friend_requests:${userId}`;

        const { data: requests, cached } = await redisController.getOrSet(
            cacheKey,
            async () => {
                const requests = await prisma.friendRequest.findMany({
                    where: {
                        receiverId: userId,
                        status: "PENDING",
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                email: true,
                                profilePicture: true,
                            },
                        },
                    },
                    orderBy: {
                        sentAt: "desc",
                    },
                });

                return requests;
            },
            CACHE_EXPIRATION
        );

        return {
            statusCode: 200,
            message: cached
                ? "Requests retrieved from cache"
                : "Requests retrieved successfully",
            data: requests,
        };
    });
}

async function getFriends(req, res) {
    return handleRequest(res, async () => {
        const token = req.headers.authorization.split(" ")[1];
        const userToken = decodeToken(token);
        if (!userToken.id) {
            return {
                statusCode: 403,
                message: "Unauthorized",
                data: null,
            };
        }

        const userId = userToken.id;

        const cacheKey = `friends:${userId}`;

        const { data: transformedFriends, cached } =
            await redisController.getOrSet(
                cacheKey,
                async () => {
                    const friends = await prisma.friendRequest.findMany({
                        where: {
                            OR: [
                                { senderId: userId, status: "ACCEPTED" },
                                { receiverId: userId, status: "ACCEPTED" },
                            ],
                        },
                        select: {
                            id: true,
                            sender: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    username: true,
                                    profilePicture: true,
                                    createdAt: true,
                                },
                            },
                            receiver: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    username: true,
                                    profilePicture: true,
                                    createdAt: true,
                                },
                            },
                        },
                    });

                    const transformedFriends = friends.map((friend) => {
                        const friendData =
                            friend.sender.id === userId
                                ? friend.receiver
                                : friend.sender;
                        return {
                            requestId: friend.id,
                            userId: friendData.id,
                            name: friendData.name,
                            email: friendData.email,
                            username: friendData.username,
                            profilePicture: friendData.profilePicture,
                            createdAt: friendData.createdAt,
                        };
                    });

                    return transformedFriends;
                },
                CACHE_EXPIRATION
            );

        return {
            statusCode: 200,
            message: cached
                ? "Friends retrieved from cache"
                : "Friends retrieved successfully",
            data: transformedFriends,
        };
    });
}

async function getNonFriends(req, res) {
    return handleRequest(res, async () => {
        const token = req.headers.authorization.split(" ")[1];
        const userToken = decodeToken(token);
        if (!userToken.id) {
            return {
                statusCode: 403,
                message: "Unauthorized",
                data: null,
            };
        }

        const userId = userToken.id;

        const cacheKey = `non_friends:${userId}`;
        const { data: transformedNonFriends, cached } =
            await redisController.getOrSet(
                cacheKey,
                async () => {
                    const nonFriends = await prisma.user.findMany({
                        where: {
                            AND: [
                                {
                                    id: {
                                        not: userId,
                                    },
                                },
                                {
                                    receivedRequests: {
                                        none: {
                                            AND: [
                                                { senderId: userId },
                                                { status: "ACCEPTED" },
                                            ],
                                        },
                                    },
                                },
                                {
                                    sentRequests: {
                                        none: {
                                            AND: [
                                                { receiverId: userId },
                                                { status: "ACCEPTED" },
                                            ],
                                        },
                                    },
                                },
                            ],
                        },
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            email: true,
                            profilePicture: true,
                            createdAt: true,
                            receivedRequests: {
                                where: {
                                    senderId: userId,
                                },
                                select: {
                                    id: true,
                                    status: true,
                                },
                            },
                            sentRequests: {
                                where: {
                                    receiverId: userId,
                                },
                                select: {
                                    id: true,
                                    status: true,
                                },
                            },
                        },
                    });

                    const transformedNonFriends = nonFriends.map((user) => {
                        let requestStatus = "NONE";
                        let requestId = null;

                        // Check received requests (requests from current user)
                        if (user.receivedRequests.length > 0) {
                            requestStatus = user.receivedRequests[0].status;
                            requestId = user.receivedRequests[0].id;
                        }
                        // Check sent requests (requests to current user)
                        else if (user.sentRequests.length > 0) {
                            requestStatus = user.sentRequests[0].status;
                            requestId = user.sentRequests[0].id;
                        }

                        // Remove the requests arrays and add status and id fields
                        const {
                            receivedRequests,
                            sentRequests,
                            ...userWithoutRequests
                        } = user;
                        return {
                            ...userWithoutRequests,
                            requestStatus,
                            requestId,
                        };
                    });

                    return transformedNonFriends;
                },
                CACHE_EXPIRATION
            );

        return {
            statusCode: 200,
            message: cached
                ? "Non-friends retrieved from cache"
                : "Non-friends retrieved successfully",
            data: transformedNonFriends,
        };
    });
}

async function getRecentChats(req, res) {
    return handleRequest(res, async () => {
        const token = req.headers.authorization.split(" ")[1];
        const userToken = decodeToken(token);
        if (!userToken.id) {
            return {
                statusCode: 403,
                message: "Unauthorized",
                data: null,
            };
        }

        const userId = userToken.id;

        if (!userId) {
            return {
                status: "error",
                message: "Invalid request",
                data: null,
            };
        }

        const cacheKey = `recent_chats:${userId}`;
        const cachedData = await redisController.get(cacheKey);

        let recentChats = [];
        if (!cachedData || !Array.isArray(cachedData)) {
            const userConversations = await prisma.participant.findMany({
                where: { userId },
                select: {
                    conversation: {
                        include: {
                            participants: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            username: true,
                                            profilePicture: true,
                                        },
                                    },
                                },
                            },
                            messages: {
                                orderBy: { createdAt: "asc" },
                                take: 20,
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
                orderBy: {
                    conversation: {
                        createdAt: "asc",
                    },
                },
            });

            const contacts = [];
            const messages = {};

            userConversations.forEach(({ conversation }) => {
                conversation.participants.forEach((p) => {
                    if (p.user.id !== userId) {
                        contacts.push({
                            id: p.user.id,
                            name: p.user.username,
                            online: false,
                            conversationId: conversation.id,
                        });
                    }
                });

                const formattedMessages = conversation.messages.map((msg) => ({
                    id: msg.id,
                    content: msg.content,
                    senderId: msg.sender.id,
                    time: formatTime(msg.createdAt),
                }));

                messages[conversation.id] = formattedMessages;
            });

            recentChats = { contacts, messages };

            if (contacts.length > 0) {
                await redisController.set(
                    cacheKey,
                    recentChats,
                    CACHE_EXPIRATION
                );
            }
        } else {
            recentChats = cachedData;
        }

        for (const conversationId in recentChats.messages) {
            try {
                const bufferKey = `chat:buffer:${conversationId}`;
                const bufferMessages = await redisController.get(bufferKey);

                if (
                    Array.isArray(bufferMessages) &&
                    bufferMessages.length > 0
                ) {
                    const buffered = bufferMessages
                        .sort(
                            (a, b) =>
                                new Date(a.timestamp) - new Date(b.timestamp)
                        )
                        .map((msg) => ({
                            id: msg.tempId,
                            content: msg.content,
                            senderId: msg.senderId,
                            time: formatTime(msg.timestamp),
                        }));

                    recentChats.messages[conversationId] = [
                        ...(recentChats.messages[conversationId] || []),
                        ...buffered,
                    ];
                }
            } catch (error) {
                console.error(
                    `Error processing buffer for chat ${conversationId}:`,
                    error
                );
            }
        }

        return {
            status: "success",
            message: "Recent chats retrieved successfully",
            data: recentChats,
        };
    });
}

async function updateProfile(req, res) {
    return handleRequest(res, async () => {
        const { username, name, email } = req.body;
        const token = req.headers.authorization.split(" ")[1];
        const userToken = decodeToken(token);

        if (!userToken.id) {
            return {
                statusCode: 403,
                message: "Unauthorized",
                data: null,
            };
        }

        const preExisting = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }],
                NOT: { id: userToken.id },
            },
        });
        if (preExisting) {
            return {
                statusCode: 400,
                message: "Username or email already exists",
                data: null,
            };
        }
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                username,
                name,
                email,
            },
        });

        await CacheInvalidator.invalidateByEvent(
            INVALIDATION_EVENTS.USER_PROFILE_UPDATED,
            {
                userId,
            }
        );

        return {
            statusCode: 200,
            message: "Profile updated successfully",
            data: user,
        };
    });
}

export {
    getFriendRequests,
    getFriends,
    getRecentChats,
    getUserProfile,
    getUsers,
    manageFriendRequest,
    searchUsers,
    sendFriendRequest,
    getNonFriends,
    updateProfile,
};
