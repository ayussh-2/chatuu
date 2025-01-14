"use client";
import { useEffect, useState } from "react";

import { ChatHeader } from "@/components/chat/chat-header";
import { MessageInput } from "@/components/chat/message-input";
import { MessageList } from "@/components/chat/message-list";
import { Sidebar } from "@/components/chat/sidebar";
import StartChatting from "@/components/chat/start-chatting";
import Loader from "@/components/loader/Loader";
import { useApi } from "@/hooks/use-Api";
import { useChatStore } from "@/lib/chat-store";
import { getSocket } from "@/utils/getSocket";
import useUser from "@/hooks/use-user";

export default function Home() {
    const { isLoading, makeRequest } = useApi();
    const { setContacts, setMessages, activeContactId, addMessage } =
        useChatStore();
    const [userId, setUserId] = useState<number | null>(null);

    const user = useUser();
    async function getUserChats() {
        const response = await makeRequest(
            "POST",
            "/user/chats",
            { userId: user?.userId },
            "Some Error occoured while fetching chats",
            true,
            false
        );
        if (!response) return;
        const { contacts, messages } = response.data;
        setContacts(contacts);
        setMessages(messages);
    }

    useEffect(() => {
        if (user) {
            getUserChats();
            setUserId(user?.userId ?? null);
        }
    }, [user]);

    useEffect(() => {
        const socket = getSocket();
        socket.on("message", ({ userId, message }) => {
            const now = new Date();
            const newMessage = {
                id: Date.now(),
                content: message,
                senderId: userId,
                time: now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Kolkata",
                }),
                timestamp: now.getTime(),
            };
            addMessage(activeContactId, newMessage);
        });

        socket.emit("joinRoom", activeContactId);

        return () => {
            socket.off("message");
            socket.emit("leaveRoom", activeContactId);
        };
    }, [activeContactId]);

    return (
        <main className="h-screen flex bg-background">
            <Loader isLoading={isLoading} />
            <Sidebar />
            {activeContactId ? (
                <div className="flex-1 flex flex-col">
                    <ChatHeader />
                    <MessageList userId={userId!} />
                    <MessageInput
                        activeContactId={activeContactId}
                        isLoading={isLoading}
                        makeRequest={makeRequest}
                        userId={userId!}
                    />
                </div>
            ) : (
                <StartChatting />
            )}
        </main>
    );
}
