import { create } from "zustand";

export type Message = {
    id: number;
    content: string;
    senderId: number;
    time: string;
};

type Contact = {
    id: number;
    name: string;
    online: boolean;
    lastMessage?: string;
    unread: number;
    conversationId: number;
};

type ChatStore = {
    contacts: Contact[];
    messages: Record<number, Message[]>;
    activeContactId: number;
    setActiveContact: (conversationId: number) => void;
    sendMessage: (content: string) => void;
    setContacts: (contacts: Contact[]) => void;
    setMessages: (messages: Record<number, Message[]>) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
    activeContactId: 0,
    contacts: [],
    messages: {},
    conversationId: 0,
    setActiveContact: (conversationId) =>
        set({ activeContactId: conversationId }),
    sendMessage: (content) =>
        set((state) => {
            const newMessage = {
                id: Date.now(),
                content,
                senderId: 0,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            return {
                messages: {
                    ...state.messages,
                    [state.activeContactId]: [
                        ...(state.messages[state.activeContactId] || []),
                        newMessage,
                    ],
                },
            };
        }),
    setContacts: (contacts) => set({ contacts }),
    setMessages: (messages) => set({ messages }),
}));
