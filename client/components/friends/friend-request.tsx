"use client";

import { mockFriendRequests } from "@/config/friends";
import { useState } from "react";
import { FriendRequestCard } from "./friend-request-card";
import { Pagination } from "./pagination";

const ITEMS_PER_PAGE = 10;

export function FriendRequests() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(mockFriendRequests.length / ITEMS_PER_PAGE);

    const paginatedRequests = mockFriendRequests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="space-y-4">
            {paginatedRequests.map((request) => (
                <FriendRequestCard key={request.id} request={request} />
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
