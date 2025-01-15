"use client";

import { User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import { SearchResult } from "@/types/friends";

interface UserSearchCardProps {
    user: SearchResult;
}

export function UserSearchCard({ user }: UserSearchCardProps) {
    return (
        <Card className="flex items-center p-[1rem]">
            <Avatar className="h-12 w-12 bg-primary-foreground text-primary-background flex items-center justify-center  ">
                {user.profilePicture ? (
                    <span>{user.name[0].toUpperCase()}</span>
                ) : (
                    <User className="h-6 w-6" />
                )}
            </Avatar>
            <div className="ml-4 flex-1">
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">
                    @{user.username}
                </p>
            </div>
            <div className="flex gap-2">
                <Button variant="default" size="sm">
                    Send Request
                </Button>
                <Button variant="ghost" size="sm">
                    View Profile
                </Button>
            </div>
        </Card>
    );
}
