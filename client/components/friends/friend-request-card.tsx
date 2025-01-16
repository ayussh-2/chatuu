"use client";

import { User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FriendRequest, User as UserType } from "@/types/friends";
import { Card } from "../ui/card";
import { useApi } from "@/hooks/use-Api";
import { useState } from "react";
import Link from "next/link";

interface FriendRequestCardProps {
    request: FriendRequest;
}

export function FriendRequestCard({ request }: FriendRequestCardProps) {
    const timeAgo = new Date(request.sentAt).toLocaleDateString();
    const [status, setStatus] = useState(
        null as "ACCEPTED" | "REJECTED" | null
    );
    const { isLoading, makeRequest } = useApi();
    async function manageRequest(status: "ACCEPTED" | "REJECTED") {
        const response = await makeRequest(
            "POST",
            "/user/manage-requests",
            { requestId: request.id, action: status },
            "Error managing request",
            true,
            false
        );
        if (response?.status !== "error") {
            setStatus(status);
        }
    }
    return (
        <Card className="flex items-center p-[1rem]">
            <Avatar className="h-12 w-12 bg-primary-foreground text-primary-background flex items-center justify-center  ">
                {request.sender.profilePicture ? (
                    <User className="h-6 w-6" />
                ) : (
                    <span>{request.sender.username[0].toUpperCase()}</span>
                )}
            </Avatar>
            <div className="ml-4 flex-1">
                <h3 className="font-medium capitalize">
                    {request.sender.username}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {request.sender.email}
                </p>
                <p className="text-xs text-muted-foreground">Sent {timeAgo}</p>
            </div>
            <div className="flex gap-2">
                {!status ? (
                    <>
                        <Link
                            href={`/profile/${request.sender.userId}`}
                            passHref
                        >
                            <Button variant="default" size="sm">
                                View Profile
                            </Button>
                        </Link>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => manageRequest("ACCEPTED")}
                            disabled={isLoading}
                            isLoading={isLoading}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => manageRequest("REJECTED")}
                            disabled={isLoading}
                            isLoading={isLoading}
                        >
                            Delete
                        </Button>
                    </>
                ) : (
                    <p className="capitalize">{status?.toLowerCase()}</p>
                )}
            </div>
        </Card>
    );
}
