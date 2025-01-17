"use client";
import { Plus, Search, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatList } from "./chat-list";
import Link from "next/link";

export function Sidebar({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}) {
    return (
        <div className="relative h-screen ml-[72px]">
            <div
                className={`fixed top-0 left-[72px] h-screen transition-all duration-300 ease-in-out 
                    ${isOpen ? "w-80" : "w-16"} 
                    border-r border-border bg-card/50 backdrop-blur-xl flex flex-col`}
                style={{
                    zIndex: 1000,
                }}
            >
                {/* Toggle Button */}
                <Button
                    variant="ghost"
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

                {/* Header */}
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

                {/* Search */}
                {isOpen && (
                    <div className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search Contacts..."
                                className="pl-9 bg-background/50"
                            />
                        </div>
                    </div>
                )}

                <ChatList collapsed={!isOpen} />
            </div>
        </div>
    );
}
