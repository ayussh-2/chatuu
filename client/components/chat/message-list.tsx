"use client";
import { motion } from "framer-motion";

import { useChatStore } from "@/lib/chat-store";

export function MessageList({ userId }: { userId: number | null }) {
    const { messages, activeContactId } = useChatStore();
    const activeMessages = messages[activeContactId] || [];

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeMessages.map((message, i) => (
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex ${
                        message.senderId === userId
                            ? "justify-end"
                            : "justify-start"
                    }`}
                >
                    <div
                        className={`flex ${
                            message.senderId === userId
                                ? "flex-row-reverse"
                                : "flex-row"
                        } items-end space-x-2`}
                    >
                        <div
                            className={`max-w-md ${
                                message.senderId === userId ? "mr-2" : "ml-2"
                            }`}
                        >
                            <div
                                className={`px-4 py-2 rounded-2xl ${
                                    message.senderId === userId
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                }`}
                            >
                                <p className="text-sm ">{message.content}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 font-plusJakarta">
                                {message.time}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
