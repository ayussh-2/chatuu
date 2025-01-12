"use client";

import { Send, Smile } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useChatStore } from "@/lib/chat-store";
import { Input } from "../ui/input";

export function MessageInput() {
    const [message, setMessage] = useState("");
    const sendMessage = useChatStore((state) => state.sendMessage);

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessage("");
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
                <Button size="icon" onClick={handleSend}>
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}
