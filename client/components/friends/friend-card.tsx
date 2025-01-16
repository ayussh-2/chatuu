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
import { useApi } from "@/hooks/use-Api";
import toast from "react-hot-toast";
import generateRandomChars from "@/utils/genRandomChars";
import { useRouter } from "next/navigation";

interface FriendCardProps {
    friend: UserType;
    loggedInUser: UserType;
}

export function FriendCard({ friend, loggedInUser }: FriendCardProps) {
    const { isLoading, makeRequest } = useApi();
    const router = useRouter();
    async function unfriend() {
        if (
            !window.confirm(`Are you sure you want to unfriend ${friend.name}?`)
        )
            return;
        const response = await makeRequest(
            "POST",
            "/user/manage-requests",
            {
                requestId: friend.requestId,
                action: "REJECTED",
            },
            "Error unfriending user",
            true,
            false
        );
        if (response?.status === "success") {
            toast.success("Unfriended successfully");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }

    async function createAndJoinChatRoom() {
        const response = await makeRequest(
            "POST",
            "/rooms/create",
            {
                name: generateRandomChars(),
                userIds: [friend.userId, loggedInUser.userId],
            },
            "Error creating chat room",
            true,
            false
        );

        if (response?.status === "success") {
            router.push(`/chats?chatId=${response.data.id}`);
        }
    }

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
            <div className="flex space-x-2 items-center">
                <Button
                    variant={"outline"}
                    size="default"
                    onClick={createAndJoinChatRoom}
                >
                    Chat
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="hover:cursor-pointer">
                            View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive hover:cursor-pointer"
                            onClick={unfriend}
                            disabled={isLoading}
                        >
                            Unfriend
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Card>
    );
}
