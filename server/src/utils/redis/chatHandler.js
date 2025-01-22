import RedisController from "./redisController.js";
import prisma from "../../config/prisma.js";

class ChatHandler {
    constructor(io) {
        this.io = io;
        this.BUFFER_SIZE = 10; // Number of messages to buffer before saving to database
        this.BUFFER_EXPIRY = 3600; // expiry in seconds
        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        this.io.on("connection", (socket) => {
            console.log("A user connected " + socket.id);

            socket.on("joinRoom", (roomId) => {
                if (socket.rooms.has(roomId)) {
                    socket.emit("error", "Already joined this room");
                    return;
                }
                socket.join(roomId);
                socket.emit("roomJoined", roomId);
            });

            socket.on("leaveRoom", (roomId) => {
                socket.leave(roomId);
            });

            socket.on("sendMessage", async ({ roomId, message, senderId }) => {
                await this.handleNewMessage(socket, {
                    conversationId: roomId,
                    content: message,
                    senderId,
                });
            });

            socket.on("disconnect", () => {
                console.log("User disconnected " + socket.id);
            });
        });
    }

    async handleNewMessage(socket, messageData) {
        try {
            const { conversationId, content, senderId } = messageData;
            const bufferKey = `chat:buffer:${conversationId}`;

            const messageObj = {
                content,
                senderId,
                conversationId,
                timestamp: new Date(),
                tempId: `msg_${Date.now()}_${Math.random()
                    .toString(36)
                    .substr(2, 9)}`,
            };

            let messageBuffer = (await RedisController.get(bufferKey)) || [];
            messageBuffer.push(messageObj);

            await RedisController.set(
                bufferKey,
                messageBuffer,
                this.BUFFER_EXPIRY
            );

            this.io.to(conversationId).emit("message", {
                senderId,
                message: content,
                roomId: conversationId,
                tempId: messageObj.tempId,
            });

            if (messageBuffer.length >= this.BUFFER_SIZE) {
                await this.saveBufferToDatabase(bufferKey);
            }
        } catch (error) {
            console.error("Error handling message:", error);
            socket.emit("error", "Failed to process message");
        }
    }

    async saveBufferToDatabase(bufferKey) {
        try {
            const messageBuffer = await RedisController.get(bufferKey);
            if (!messageBuffer || messageBuffer.length === 0) return;

            const sortedMessages = messageBuffer.sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );

            await prisma.$transaction(async (prisma) => {
                for (const msg of sortedMessages) {
                    const message = await prisma.message.create({
                        data: {
                            content: msg.content,
                            senderId: msg.senderId,
                            conversationId: msg.conversationId,
                        },
                        include: {
                            sender: true,
                            conversation: true,
                        },
                    });

                    await prisma.conversation.update({
                        where: { id: msg.conversationId },
                        data: { lastMessageId: message.id },
                    });
                }
            });

            // console.log("Buffer saved to database:", bufferKey);

            await RedisController.delete(bufferKey);
        } catch (error) {
            console.error("Error saving buffer to database:", error);
        }
    }

    async saveAllBuffers() {
        try {
            const bufferKeys = await RedisController.getKeys("chat:buffer:*");
            for (const bufferKey of bufferKeys) {
                await this.saveBufferToDatabase(bufferKey);
            }
        } catch (error) {
            console.error("Error saving all buffers:", error);
        }
    }
}

export default ChatHandler;
