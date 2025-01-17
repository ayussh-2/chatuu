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
import { useSearchParams } from "next/navigation";

export default function Home() {
    const [isOpen, setIsOpen] = useState(true);

    const { isLoading, makeRequest } = useApi();
    const {
        setContacts,
        setMessages,
        activeContactId,
        addMessage,
        setActiveContact,
    } = useChatStore();
    const [userId, setUserId] = useState<number | null>(null);
    const searchParams = useSearchParams();
    const activeContactIdFromUrl = searchParams.get("chatId");
    const [unreadMessages, setUnreadMessages] = useState<any[]>([]);

    useEffect(() => {
        if (activeContactIdFromUrl) {
            setActiveContact(parseInt(activeContactIdFromUrl));
        }
    }, [activeContactIdFromUrl]);

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

        const roomIds = contacts.map(
            (contact: { conversationId: number }) => contact.conversationId
        );
        joinRooms(roomIds);
    }

    function joinRooms(roomIds: number[]) {
        const socket = getSocket();
        roomIds.forEach((roomId) => {
            socket.emit("joinRoom", roomId);
        });
    }

    useEffect(() => {
        if (user) {
            getUserChats();
            setUserId(user?.userId ?? null);
        }
    }, [user]);

    useEffect(() => {
        const socket = getSocket();
        socket.on(
            "message",
            ({
                message,
                senderId,
                roomId,
            }: {
                message: string;
                senderId: number;
                roomId: number;
            }) => {
                const now = new Date();
                const newMessage = {
                    id: Date.now(),
                    content: message,
                    senderId,
                    time: now.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Asia/Kolkata",
                    }),
                    timestamp: now.getTime(),
                };

                const unreadMessage = roomId !== activeContactId;
                if (unreadMessage) {
                    setUnreadMessages((prev) => [...prev, roomId]);
                }
                addMessage(roomId, newMessage);
            }
        );
        if (activeContactId) {
            setUnreadMessages((prev) =>
                prev.filter((id) => id !== activeContactId)
            );
            console.log(activeContactId);
        }
        return () => {
            socket.off("message");
        };
    }, [activeContactId]);

    return (
        <div className="h-screen flex bg-background overflow-hidden">
            <Loader isLoading={isLoading} />
            <Sidebar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                unreadMessages={unreadMessages}
            />
            {activeContactId ? (
                <div
                    className={`flex-1 flex flex-col transition-all duration-300 ${
                        isOpen ? "ml-[248px]" : "-ml-[8px]"
                    }`}
                >
                    <ChatHeader />
                    <MessageList userId={userId!} />
                    <MessageInput
                        activeContactId={activeContactId}
                        userId={userId!}
                    />
                </div>
            ) : (
                <div
                    className={`flex-1 ${isOpen ? "ml-[248px]" : "-ml-[8px]"}`}
                >
                    <StartChatting />
                </div>
            )}
        </div>
    );
}
