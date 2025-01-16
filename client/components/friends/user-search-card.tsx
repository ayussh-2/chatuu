"use client";

import { User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import { SearchResult } from "@/types/friends";
import { useApi } from "@/hooks/use-Api";
import useUser from "@/hooks/use-user";
import toast from "react-hot-toast";

interface UserSearchCardProps {
    user: SearchResult;
}

export function UserSearchCard({ user }: UserSearchCardProps) {
    const { isLoading, makeRequest } = useApi();
    const loggedInUser = useUser();
    const sendRequest = async () => {
        const response = await makeRequest(
            "POST",
            "/user/send-request",
            {
                friendId: user.id,
                selfId: loggedInUser?.userId,
            },
            "Error sending friend request",
            true,
            false
        );
        if (response?.data) {
            toast.success("Friend request sent successfully");
        }
    };
    return (
        <Card className="flex items-center p-[1rem]">
            <Avatar className="h-12 w-12 bg-primary-foreground text-primary-background flex items-center justify-center  ">
                {user.profilePicture ? (
                    <User className="h-6 w-6" />
                ) : (
                    <span>{user.name[0].toUpperCase()}</span>
                )}
            </Avatar>
            <div className="ml-4 flex-1">
                <h3 className="font-medium capitalize">{user.username}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex gap-2">
                <Button
                    variant="default"
                    size="sm"
                    disabled={isLoading}
                    onClick={sendRequest}
                    isLoading={isLoading}
                >
                    Send Request
                </Button>
                <Button variant="ghost" size="sm">
                    View Profile
                </Button>
            </div>
        </Card>
    );
}
