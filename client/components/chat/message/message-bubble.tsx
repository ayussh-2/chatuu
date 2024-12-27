"use client";

import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/lib/chat/types";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwnMessage ? "flex-row-reverse" : "flex-row"} items-end space-x-2`}>
      {!isOwnMessage && (
        <Avatar className="w-8 h-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
        </Avatar>
      )}
      <div className={`max-w-md ${isOwnMessage ? "mr-2" : "ml-2"}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwnMessage
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              : "bg-muted"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {message.time}
        </p>
      </div>
    </div>
  );
}