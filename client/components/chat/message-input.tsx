"use client";

import { LoaderCircle, Send, Smile } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "../ui/input";
import { getSocket } from "@/utils/getSocket";
import { useApi } from "@/hooks/use-Api";

interface MessageInputProps {
    activeContactId: number;

    userId: number;
}

export function MessageInput({
    activeContactId,

    userId,
}: MessageInputProps) {
    const [message, setMessage] = useState("");
    const { isLoading, makeRequest } = useApi();
    const handleSend = async () => {
        if (!message.trim()) return;
        const socket = getSocket();

        try {
            socket.emit("sendMessage", {
                roomId: activeContactId,
                message: message.trim(),
                senderId: userId,
            });

            const response = await makeRequest(
                "POST",
                "/rooms/sendmessage",
                {
                    content: message.trim(),
                    conversationId: activeContactId,
                    userId,
                },
                "Error sending message",
                true,
                false
            );

            if (!response) return;
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 border-t bg-card/50 backdrop-blur-xl"
        >
            <div className="flex items-end space-x-2">
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Say something..."
                    className="resize-none bg-background/50"
                />
                <Button variant="ghost" size="icon">
                    <Smile className="w-5 h-5" />
                </Button>
                <Button size="icon" onClick={handleSend} disabled={isLoading}>
                    {isLoading ? (
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                </Button>
            </div>
        </motion.div>
    );
}
