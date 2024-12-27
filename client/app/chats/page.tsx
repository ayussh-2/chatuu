"use client";
import { Sidebar } from "@/components/chat/sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import Loader from "@/components/loader/Loader";
import { useApi } from "@/hooks/use-Api";
import { useEffect } from "react";
import { useChatStore } from "@/lib/chat-store";
import StartChatting from "@/components/chat/start-chatting";

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
        if (!response) return;
        const { contacts, messages } = response.data;
        setContacts(contacts);
        setMessages(messages);
    }

    useEffect(() => {
        getUserChats();
    }, []);
    return (
        <main className="h-screen flex bg-background">
            <Loader isLoading={isLoading} />
            <Sidebar />
            {activeContactId ? (
                <div className="flex-1 flex flex-col">
                    <ChatHeader />
                    <MessageList />
                    <MessageInput />
                </div>
            ) : (
                <StartChatting />
            )}
        </main>
    );
}
