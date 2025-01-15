"use client";

import { mockFriends } from "@/config/friends";
import { useState } from "react";
import { FriendCard } from "./friend-card";
import { Pagination } from "./pagination";

const ITEMS_PER_PAGE = 10;

export function FriendsList() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(mockFriends.length / ITEMS_PER_PAGE);

    const paginatedFriends = mockFriends.slice(
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
        </div>
    );
}
