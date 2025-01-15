"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsList } from "@/components/friends/friends-list";
import { FriendRequests } from "@/components/friends/friend-request";
import { AddFriends } from "@/components/friends/add-friends";

export default function FriendsPage() {
    return (
        <section className="max-w-4xl mx-auto p-[2rem]">
            <h1 className="text-2xl font-bold mb-6">Friends</h1>
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
