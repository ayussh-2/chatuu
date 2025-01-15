"use client";

import { User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FriendRequest } from "@/types/friends";
import { Card } from "../ui/card";

interface FriendRequestCardProps {
    request: FriendRequest;
}

export function FriendRequestCard({ request }: FriendRequestCardProps) {
    const timeAgo = new Date(request.sentAt).toLocaleDateString();

    return (
        <Card className="flex items-center p-[1rem]">
            <Avatar className="h-12 w-12 bg-primary-foreground text-primary-background flex items-center justify-center  ">
                {request.sender.profilePicture ? (
                    <span>{request.sender.name[0].toUpperCase()}</span>
                ) : (
                    <User className="h-6 w-6" />
                )}
            </Avatar>
            <div className="ml-4 flex-1">
                <h3 className="font-medium">{request.sender.name}</h3>
                <p className="text-sm text-muted-foreground">
                    @{request.sender.username}
                </p>
                <p className="text-xs text-muted-foreground">Sent {timeAgo}</p>
            </div>
            <div className="flex gap-2">
                <Button variant="default" size="sm">
                    Accept
                </Button>
                <Button variant="ghost" size="sm">
                    Delete
                </Button>
            </div>
        </Card>
    );
}
