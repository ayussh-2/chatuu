"use client";
import { Sidebar } from "@/components/chat/sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import Loader from "@/components/loader/Loader";
import { useApi } from "@/hooks/use-Api";
import { useEffect } from "react";

export default function Home() {
    const { isLoading, makeRequest } = useApi();
    async function getUserChats() {
        const response = await makeRequest(
            "POST",
            "/user/chats",
            { userId: 1 },
            "Some Error occoured while fetching chats",
            true
        );
        console.log(response);
    }

    useEffect(() => {
        getUserChats();
    }, []);
    return (
        <main className="h-screen flex bg-background">
            <Loader isLoading={isLoading} />
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <ChatHeader />
                <MessageList />
                <MessageInput />
            </div>
        </main>
    );
}
