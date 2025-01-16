"use client";

import { User, MoreVertical } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserType } from "@/types/auth/auth";
import { Card } from "../ui/card";

interface FriendCardProps {
    friend: UserType;
}

export function FriendCard({ friend }: FriendCardProps) {
    console.log(friend);
    return (
        <Card className="flex items-center p-[1rem]">
            <Avatar className="h-12 w-12 bg-primary-foreground text-primary-background flex items-center justify-center  ">
                {friend.profilePicture ? (
                    <span>{friend?.name?.[0]?.toUpperCase() ?? ""}</span>
                ) : (
                    <User className="h-6 w-6" />
                )}
            </Avatar>
            <div className="ml-4 flex-1">
                <h3 className="font-medium">{friend.name}</h3>
                <p className="text-sm text-muted-foreground">
                    @{friend.username}
                </p>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                        Unfriend
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                        Block
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Card>
    );
}
