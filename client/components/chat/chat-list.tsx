"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { useChatStore } from "@/lib/chat-store";

export function ChatList() {
    const { contacts, messages, activeContactId, setActiveContact } =
        useChatStore();

    const getLastMessage = (contactId: number) => {
        const contactMessages = messages[contactId] || [];
        return contactMessages[contactMessages.length - 1]?.content || "";
    };

    return (
        <div className="flex-1 overflow-y-auto">
            {contacts.map((chat, i) => (
                <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 hover:bg-accent/50 cursor-pointer transition-colors ${
                        activeContactId === chat.id ? "bg-accent/50" : ""
                    }`}
                    onClick={() => setActiveContact(chat.id)}
                >
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Avatar>
                                <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center">
                                    {chat.name[0]}
                                </div>
                            </Avatar>
                            {chat.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium truncate">
                                    {chat.name}
                                </p>
                                {chat.unread > 0 && (
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center ml-2">
                                        <span className="text-xs text-primary-foreground">
                                            {chat.unread}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                                {getLastMessage(chat.id)}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
