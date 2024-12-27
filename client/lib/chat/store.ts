import { create } from 'zustand';
import { ChatStore } from './types';
import { initialContacts, initialMessages } from './initial-data';
import { formatMessageTime } from './utils';

export const useChatStore = create<ChatStore>((set) => ({
  activeContactId: 1,
  contacts: initialContacts,
  messages: initialMessages,
  setActiveContact: (id) => set({ activeContactId: id }),
  sendMessage: (content) => set((state) => {
    const newMessage = {
      id: Date.now(),
      content,
      senderId: 0,
      time: formatMessageTime(new Date()),
    };
    
    return {
      messages: {
        ...state.messages,
        [state.activeContactId]: [...(state.messages[state.activeContactId] || []), newMessage],
      },
    };
  }),
}));