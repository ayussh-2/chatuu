import { User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import { SearchResult, User as UserType } from "@/types/friends";
import { useApi } from "@/hooks/use-Api";
import { useState } from "react";

interface UserSearchCardProps {
    user: SearchResult;
    loggedInUser: UserType;
}

export function UserSearchCard({ user, loggedInUser }: UserSearchCardProps) {
    const { isLoading, makeRequest } = useApi();
    const [status, setStatus] = useState("");
    const isPending = user.requestStatus === "PENDING";

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
        console.log({
            friendId: user.id,
            selfId: loggedInUser?.userId,
        });
        if (response?.status !== "error") {
            setStatus("SENT");
        }
    };

    const deleteRequest = async () => {
        const response = await makeRequest(
            "POST",
            "/user/manage-requests",
            { requestId: user.requestId, action: "CANCELED" },
            "Error deleting friend request",
            true,
            false
        );
        if (response?.status !== "error") {
            setStatus("DELETED");
        }
    };

    const renderButtons = () => {
        if (status !== "" && !isPending) {
            return (
                <Button variant={"outline"} size="sm" disabled>
                    {status === "SENT" ? "Request Sent" : "Request Deleted"}
                </Button>
            );
        }

        return (
            <>
                {status ? (
                    <p className="m-0">
                        <Button variant={"outline"} size="sm" disabled>
                            {status === "SENT"
                                ? "Request Sent"
                                : "Request Deleted"}
                        </Button>
                    </p>
                ) : isPending ? (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={deleteRequest}
                        isLoading={isLoading}
                    >
                        Delete Request
                    </Button>
                ) : (
                    <Button
                        variant="default"
                        size="sm"
                        disabled={isLoading}
                        onClick={sendRequest}
                        isLoading={isLoading}
                    >
                        Send Request
                    </Button>
                )}
                <Button variant="ghost" size="sm">
                    View Profile
                </Button>
            </>
        );
    };

    return (
        <Card className="flex items-center p-4">
            <Avatar className="h-12 w-12 bg-primary-foreground text-primary-background flex items-center justify-center">
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
            <div className="flex gap-2">{renderButtons()}</div>
        </Card>
    );
}
