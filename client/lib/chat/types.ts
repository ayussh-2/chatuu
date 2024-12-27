export type Message = {
  id: number;
  content: string;
  senderId: number;
  time: string;
};

export type Contact = {
  id: number;
  name: string;
  online: boolean;
  lastMessage?: string;
  unread: number;
};

export type ChatStore = {
  contacts: Contact[];
  messages: Record<number, Message[]>;
  activeContactId: number;
  setActiveContact: (id: number) => void;
  sendMessage: (content: string) => void;
};