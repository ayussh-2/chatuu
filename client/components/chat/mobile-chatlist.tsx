import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatList } from "./chat-list";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/lib/chat-store";

const MobileChatInterface = () => {
    const setSearchQuery = useChatStore((state) => state.setSearchQuery);

    return (
        <div className="h-[100dvh] w-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key="chat-list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full flex flex-col"
                >
                    <div className="px-4 py-3 flex items-center justify-between border-b bg-card/50 backdrop-blur-xl">
                        <h1 className="text-xl font-semibold text-white font-syne">
                            Chatuu
                        </h1>
                        <Link href="/friends">
                            <Button variant="ghost" size="icon">
                                <Plus />
                            </Button>
                        </Link>
                    </div>

                    <div className="p-4 bg-card/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search Contacts..."
                                className="pl-9 bg-background/50"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <ChatList collapsed={false} />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default MobileChatInterface;
