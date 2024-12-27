"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { useChatStore } from "@/lib/chat-store";

export function ChatHeader() {
    const { contacts, activeContactId } = useChatStore();
    const activeContact = contacts.find((c) => c.id === activeContactId);

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-16 border-b flex items-center px-6 bg-background/50 backdrop-blur-xl"
        >
            <div className="flex items-center space-x-4">
                <Avatar>
                    <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center">
                        {activeContact?.name[0]}
                    </div>
                </Avatar>
                <div>
                    <h2 className="text-sm font-semibold">
                        {activeContact?.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        {activeContact?.online ? "Online" : "Offline"}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
