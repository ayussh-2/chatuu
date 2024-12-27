"use client";

import { Search, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatList } from "./chat-list";

export function Sidebar() {
  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-80 border-r border-border bg-card/50 backdrop-blur-xl h-screen flex flex-col"
    >
      <div className="p-4 flex items-center justify-between border-b">
        <h1 className="text-xl font-semibold text-white">
         Chatuu
        </h1>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Contacts..."
            className="pl-9 bg-background/50"
          />
        </div>
      </div>
      
      <ChatList />
    </motion.div>
  );
}