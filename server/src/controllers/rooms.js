import prisma from "../config/prisma.js";
import redisClient from "../config/redis.js";
import giveError from "../utils/giveError.js";

async function createRoom(req, res) {
    const { name, userIds } = req.body;
    try {
        const conversation = await prisma.conversation.create({
            data: {
                name,
                participants: {
                    create: userIds.map((userId) => ({ userId })),
                },
            },
            include: {
                participants: true,
            },
        });

        await redisClient.set(
            `conversation:${conversation.id}`,
            JSON.stringify(conversation)
        );

        req.io.emit("roomCreated", conversation);

        res.status(201).json({
            message: "Room created successfully",
            status: "success",
            room: conversation,
        });
    } catch (err) {
        giveError(err, res);
    }
}

async function getRooms(req, res) {
    try {
        const conversations = await prisma.conversation.findMany({
            include: {
                participants: true,
                lastMessage: true,
            },
        });

        res.status(200).json({
            message: "Rooms retrieved successfully",
            status: "success",
            rooms: conversations,
        });
    } catch (err) {
        giveError(err, res);
    }
}

async function joinRoom(req, res) {
    const { conversationId, userId } = req.body;
    try {
        let conversation = JSON.parse(
            await redisClient.get(`conversation:${conversationId}`)
        );

        if (!conversation) {
            conversation = await prisma.conversation.findUnique({
                where: { id: conversationId },
                include: { participants: true },
            });
            if (!conversation) {
                return res.status(404).json({
                    message: "Room not found",
                    status: "error",
                });
            }
        }

        if (!conversation.participants.some((p) => p.userId === userId)) {
            conversation = await prisma.conversation.update({
                where: { id: conversationId },
                data: {
                    participants: {
                        create: { userId },
                    },
                },
                include: { participants: true },
            });
            await redisClient.set(
                `conversation:${conversationId}`,
                JSON.stringify(conversation)
            );
        }

        req.io
            .to(conversationId.toString())
            .emit("userJoined", { conversationId, userId });

        res.status(200).json({
            message: "Joined room successfully",
            status: "success",
            room: conversation,
        });
    } catch (err) {
        giveError(err, res);
    }
}

async function sendMessage(req, res) {
    const { conversationId, userId, content } = req.body;
    try {
        const message = await prisma.message.create({
            data: {
                content,
                senderId: userId,
                conversationId,
            },
            include: {
                sender: true,
                conversation: true,
            },
        });

        await prisma.conversation.update({
            where: { id: conversationId },
            data: { lastMessageId: message.id },
        });

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { participants: true, lastMessage: true },
        });

        await redisClient.set(
            `conversation:${conversationId}`,
            JSON.stringify(conversation)
        );

        res.status(200).json({
            message: "Message sent successfully",
            status: "success",
            message,
        });
    } catch (err) {
        giveError(err, res);
    }
}

async function getMessages(req, res) {
    const { conversationId } = req.body;
    try {
        const cachedMessages = await redisClient.get(
            `conversation:${conversationId}`
        );

        if (cachedMessages) {
            return res.status(200).json({
                message: "Messages retrieved successfully",
                status: "success",
                messages: JSON.parse(cachedMessages),
            });
        }

        const messages = await prisma.message.findMany({
            where: { conversationId },
            include: { sender: true },
        });

        res.status(200).json({
            message: "Messages retrieved successfully",
            status: "success",
            messages,
        });
    } catch (err) {
        giveError(err, res);
    }
}

export { createRoom, getRooms, joinRoom, sendMessage, getMessages };
