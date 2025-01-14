"use client";
import { useEffect } from "react";

import { ChatHeader } from "@/components/chat/chat-header";
import { MessageInput } from "@/components/chat/message-input";
import { MessageList } from "@/components/chat/message-list";
import { Sidebar } from "@/components/chat/sidebar";
import StartChatting from "@/components/chat/start-chatting";
import Loader from "@/components/loader/Loader";
import { useApi } from "@/hooks/use-Api";
import { useChatStore } from "@/lib/chat-store";
import { getSocket } from "@/utils/getSocket";

export default function Home() {
    const { isLoading, makeRequest } = useApi();
    const { setContacts, setMessages, activeContactId } = useChatStore();
    async function getUserChats() {
        const response = await makeRequest(
            "POST",
            "/user/chats",
            { userId: 1 },
            "Some Error occoured while fetching chats",
            true,
            false
        );
        console.log(response);
        if (!response) return;
        const { contacts, messages } = response.data;
        setContacts(contacts);
        setMessages(messages);
    }

    useEffect(() => {
        getUserChats();
    }, []);

    useEffect(() => {
        const socket = getSocket();
        socket.on("message", (message) => {
            console.log(message);
        });

        return () => {
            socket.off("message");
        };
    }, []);

    return (
        <main className="h-screen flex bg-background">
            <Loader isLoading={isLoading} />
            <Sidebar />
            {activeContactId ? (
                <div className="flex-1 flex flex-col">
                    <ChatHeader />
                    <MessageList />
                    <MessageInput
                        activeContactId={activeContactId}
                        isLoading={isLoading}
                        makeRequest={makeRequest}
                    />
                </div>
            ) : (
                <StartChatting />
            )}
        </main>
    );
}
