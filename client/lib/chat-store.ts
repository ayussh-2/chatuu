import { create } from 'zustand';

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
};

type ChatStore = {
  contacts: Contact[];
  messages: Record<number, Message[]>;
  activeContactId: number;
  setActiveContact: (id: number) => void;
  sendMessage: (content: string) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  activeContactId: 1,
  contacts: [
    { id: 1, name: "Alice Smith", online: true, unread: 2 },
    { id: 2, name: "Bob Johnson", online: false, unread: 0 },
    { id: 3, name: "Web Dev Team", online: true, unread: 5 },
  ],
  messages: {
    1: [
      { id: 1, content: "Hey there! How are you?", senderId: 1, time: "10:00 AM" },
      { id: 2, content: "I'm doing great! How about you?", senderId: 0, time: "10:02 AM" },
    ],
    2: [
      { id: 1, content: "Did you check the latest PR?", senderId: 2, time: "9:45 AM" },
    ],
    3: [
      { id: 1, content: "Team meeting at 3 PM", senderId: 3, time: "Yesterday" },
    ],
  },
  setActiveContact: (id) => set({ activeContactId: id }),
  sendMessage: (content) => set((state) => {
    const newMessage = {
      id: Date.now(),
      content,
      senderId: 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    return {
      messages: {
        ...state.messages,
        [state.activeContactId]: [...(state.messages[state.activeContactId] || []), newMessage],
      },
    };
  }),
}));