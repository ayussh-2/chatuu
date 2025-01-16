"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsList } from "@/components/friends/friends-list";
import { FriendRequests } from "@/components/friends/friend-request";
import { AddFriends } from "@/components/friends/add-friends";
import { useApi } from "@/hooks/use-Api";
import useUser from "@/hooks/use-user";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/Loader";

export default function FriendsPage() {
    const [data, setData] = useState({
        friends: [],
        users: [],
        friendRequests: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const { makeRequest } = useApi();
    const user = useUser();

    const fetchData = async () => {
        if (!user?.userId) return;
        try {
            setIsLoading(true);
            const [friendsResponse, requestsResponse, usersResponse] =
                await Promise.all([
                    makeRequest(
                        "POST",
                        "/user/friends",
                        { userId: user.userId },
                        "Error fetching friends",
                        true,
                        false
                    ),
                    makeRequest(
                        "POST",
                        "/user/requests",
                        { userId: user.userId },
                        "Error fetching friend requests",
                        true,
                        false
                    ),
                    makeRequest(
                        "POST",
                        "/user/non-friends",
                        {
                            userId: user.userId,
                        },
                        "Error fetching users",
                        true,
                        false
                    ),
                ]);

            setData({
                friends: friendsResponse?.data || [],
                friendRequests: requestsResponse?.data || [],
                users: usersResponse?.data || [],
            });
        } catch (error) {
            console.error("Error fetching friends data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const { friends, friendRequests, users } = data;

    return (
        <section className="max-w-4xl mx-auto p-[2rem]">
            <Loader isLoading={isLoading} />
            <h1 className="text-2xl font-bold mb-6 font-syne">Friends</h1>
            <Tabs defaultValue="friends">
                <TabsList className="mb-4">
                    <TabsTrigger value="friends">Friends</TabsTrigger>
                    <TabsTrigger value="requests">Friend Requests</TabsTrigger>
                    <TabsTrigger value="add">Add Friends</TabsTrigger>
                </TabsList>
                <TabsContent value="friends">
                    <FriendsList friends={friends} loggedInUser={user} />
                </TabsContent>
                <TabsContent value="requests">
                    <FriendRequests friendRequests={friendRequests} />
                </TabsContent>
                <TabsContent value="add">
                    <AddFriends users={users} loggedInUser={user} />
                </TabsContent>
            </Tabs>
        </section>
    );
}
