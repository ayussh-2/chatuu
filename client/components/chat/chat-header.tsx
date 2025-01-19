"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { useChatStore } from "@/lib/chat-store";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { ModeToggle } from "../theme-toggle";

export function ChatHeader() {
    const { contacts, activeContactId, setActiveContact } = useChatStore();
    const activeContact = contacts.find(
        (c) => c.conversationId === activeContactId
    );

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-16 border-b flex items-center px-2 ssm:px-6 bg-background/50 backdrop-blur-xl"
        >
            <div className="flex items-center space-x-4">
                <Button
                    size={"icon"}
                    variant={"ghost"}
                    className="smd:hidden"
                    onClick={() => setActiveContact(null)}
                >
                    <ChevronLeft size={20} />
                </Button>
                <Avatar>
                    <div className="uppercase w-10 h-10 rounded-full bg-secondary dark:text-white text-black flex items-center justify-center font-syne">
                        {activeContact?.name[0]}
                    </div>
                </Avatar>
                <div>
                    <h2 className="text-base font-semibold font-syne capitalize">
                        {activeContact?.name}
                    </h2>
                    <p className="text-xs text-muted-foreground font-plusJakarta">
                        {activeContact?.online ? "Online" : "Offline"}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
