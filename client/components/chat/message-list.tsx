"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useChatStore } from "@/lib/chat-store";

export function MessageList({ userId }: { userId: number }) {
    const { messages, activeContactId } = useChatStore();
    const activeMessages = messages[activeContactId] || [];
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeMessages]);

    return (
        <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
                {activeMessages.map((message) => {
                    const isCurrentUser = message.senderId === userId;
                    console.log(message.senderId, userId);
                    return (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${
                                isCurrentUser ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`flex max-w-[70%] ${
                                    isCurrentUser
                                        ? "flex-row-reverse"
                                        : "flex-row"
                                } items-end ${
                                    isCurrentUser
                                        ? "space-x-reverse space-x-2"
                                        : "space-x-2"
                                }`}
                            >
                                <div>
                                    <div
                                        className={`px-4 py-2 rounded-2xl ${
                                            isCurrentUser
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-muted rounded-bl-none"
                                        }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap break-words">
                                            {message.content}
                                        </p>
                                    </div>
                                    <p
                                        className={`text-xs text-muted-foreground mt-1 font-plusJakarta ${
                                            isCurrentUser
                                                ? "text-right"
                                                : "text-left"
                                        }`}
                                    >
                                        {message.time}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
