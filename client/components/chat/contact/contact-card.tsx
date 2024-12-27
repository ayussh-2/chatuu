"use client";

import { Avatar } from "@/components/ui/avatar";
import { Contact } from "@/lib/chat/types";

interface ContactCardProps {
  contact: Contact;
  isActive: boolean;
  onClick: () => void;
}

export function ContactCard({ contact, isActive, onClick }: ContactCardProps) {
  return (
    <div
      className={`p-4 hover:bg-accent/50 cursor-pointer transition-colors ${
        isActive ? "bg-accent/50" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
          </Avatar>
          {contact.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium truncate">{contact.name}</p>
          </div>
        </div>
        {contact.unread > 0 && (
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-xs text-white">
              {contact.unread}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}