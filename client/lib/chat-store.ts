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
    activeContactId: number | null;
    setActiveContact: (conversationId: number | null) => void;
    sendMessage: (content: string, senderId: number) => void;
    setContacts: (contacts: Contact[]) => void;
    setMessages: (messages: Record<number, Message[]>) => void;
    addMessage: (conversationId: number, message: Message) => void;
    setUnreadMessages: (unreadMessages: number[]) => void;
    unreadMessages: number[];
};

export const useChatStore = create<ChatStore>((set) => ({
    activeContactId: null,
    contacts: [],
    messages: {},
    unreadMessages: [],
    setActiveContact: (conversationId) =>
        set({ activeContactId: conversationId }),

    sendMessage: (content, senderId) =>
        set((state) => {
            const newMessage = {
                id: Date.now(),
                content,
                senderId,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            if (state.activeContactId === null) {
                return state;
            }

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

    addMessage: (conversationId, message) =>
        set((state) => ({
            messages: {
                ...state.messages,
                [conversationId]: [
                    ...(state.messages[conversationId] || []),
                    message,
                ],
            },
        })),

    setUnreadMessages: (unreadMessages) =>
        set((state) => ({
            unreadMessages:
                typeof unreadMessages === "function"
                    ? // @ts-ignore - zustand types are incorrect
                      unreadMessages(state.unreadMessages)
                    : unreadMessages,
        })),
}));
