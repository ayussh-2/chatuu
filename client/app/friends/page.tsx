"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsList } from "@/components/friends/friends-list";
import { FriendRequests } from "@/components/friends/friend-request";
import { AddFriends } from "@/components/friends/add-friends";
import { useApi } from "@/hooks/use-Api";
import { Sidebar } from "@/components/chat/sidebar";
import useUser from "@/hooks/use-user";
import { useEffect } from "react";
import Loader from "@/components/ui/loader";

export default function FriendsPage() {
    const { isLoading, makeRequest } = useApi();
    const user = useUser();
    async function getFriends() {
        console.log(user?.userId);
        const response = await makeRequest(
            "POST",
            "/user/friends",
            {
                userId: user?.userId,
            },
            "Some Error occoured while fetching friends",
            true,
            false
        );
        if (!response) return;
        console.log(response.data);
    }

    useEffect(() => {
        if (user) {
            getFriends();
        }
    }, [user]);

    return (
        <section className="max-w-4xl mx-auto p-[2rem]">
            {isLoading && <Loader />}
            <h1 className="text-2xl font-bold mb-6 font-syne">Friends</h1>
            <Tabs defaultValue="friends">
                <TabsList className="mb-4">
                    <TabsTrigger value="friends">Friends</TabsTrigger>
                    <TabsTrigger value="requests">Friend Requests</TabsTrigger>
                    <TabsTrigger value="add">Add Friends</TabsTrigger>
                </TabsList>
                <TabsContent value="friends">
                    <FriendsList />
                </TabsContent>
                <TabsContent value="requests">
                    <FriendRequests />
                </TabsContent>
                <TabsContent value="add">
                    <AddFriends />
                </TabsContent>
            </Tabs>
        </section>
    );
}
