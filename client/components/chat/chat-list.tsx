import { useChatStore } from "@/lib/chat-store";
import { Avatar } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export function ChatList({ collapsed = false }: { collapsed?: boolean }) {
    const {
        messages,
        activeContactId,
        setActiveContact,
        unreadMessages,
        filteredContacts,
    } = useChatStore();

    const getLastMessage = (contactId: number) => {
        const contactMessages = messages[contactId] || [];
        return contactMessages[contactMessages.length - 1]?.content || "";
    };

    return (
        <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((chat, i) => (
                <motion.div
                    key={chat.conversationId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`${collapsed ? "py-3 px-2" : "p-4"} 
                        hover:bg-accent/50 cursor-pointer transition-colors
                        ${
                            activeContactId === chat.conversationId
                                ? "bg-accent/50"
                                : ""
                        }`}
                    onClick={() => setActiveContact(chat.conversationId)}
                >
                    {collapsed ? (
                        <div className="relative flex justify-center">
                            <Avatar>
                                <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-syne">
                                    {chat.name[0]}
                                </div>
                            </Avatar>
                            {chat.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                            )}
                            {unreadMessages.includes(chat.conversationId) && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                    <span className="text-xs font-bold text-primary-foreground font-inter">
                                        {chat.unread}
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Avatar>
                                    <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-syne">
                                        {chat.name[0]}
                                    </div>
                                </Avatar>
                                {chat.online && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium truncate font-syne">
                                        {chat.name}
                                    </p>
                                    {unreadMessages.includes(
                                        chat.conversationId
                                    ) && (
                                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center ml-2">
                                            <span className="text-[8px] text-primary-foreground font-inter">
                                                New
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate font-plusJakarta">
                                    {getLastMessage(chat.conversationId)}
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>
            ))}

            {filteredContacts.length === 0 && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No chats found. :) </p>
                </div>
            )}
        </div>
    );
}
