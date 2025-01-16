"use client";
import { useState } from "react";
import { FriendCard } from "./friend-card";
import { Pagination } from "./pagination";

export function FriendsList({
    friends,
}: {
    friends: { id: string; name: string; avatar: string }[];
}) {
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(friends.length / ITEMS_PER_PAGE);

    const paginatedFriends = friends.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="space-y-4">
            {paginatedFriends.map((friend) => (
                <FriendCard key={friend.id} friend={friend} />
            ))}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {!friends.length && (
                <div className="grid place-items-center h-[60vh]">
                    {" "}
                    <h1 className="text-2xl font-bold font-plusJakarta">
                        No friends yet! Start adding friends to see them here.
                    </h1>
                </div>
            )}
        </div>
    );
}
