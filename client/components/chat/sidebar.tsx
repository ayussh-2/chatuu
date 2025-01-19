"use client";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatList } from "./chat-list";
import Link from "next/link";
import { useChatStore } from "@/lib/chat-store";

export function Sidebar({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}) {
    const setSearchQuery = useChatStore((state) => state.setSearchQuery);

    return (
        <div className="relative hidden smd:block h-screen ml-[72px]">
            <div
                className={`fixed top-0 left-[72px] h-screen transition-all duration-300 ease-in-out 
                    ${isOpen ? "w-80" : "w-16"} 
                    border-r border-border bg-card/50 backdrop-blur-xl flex flex-col`}
                style={{
                    zIndex: 1000,
                }}
            >
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-40 rounded-full bg-background shadow-md"
                >
                    {isOpen ? (
                        <ChevronLeft className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>

                <div className="p-3 flex items-center justify-between border-b">
                    {isOpen && (
                        <h1 className="text-xl font-semibold text-white font-syne">
                            Chatuu
                        </h1>
                    )}
                    <Link href="/friends">
                        <Button variant="ghost" size="icon">
                            <Plus className={isOpen ? "" : "mx-auto"} />
                        </Button>
                    </Link>
                </div>

                {isOpen && (
                    <div className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search Contacts..."
                                className="pl-9 bg-background/50"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <ChatList collapsed={!isOpen} />
            </div>
        </div>
    );
}
