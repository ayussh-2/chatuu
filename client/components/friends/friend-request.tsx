"use client";

import { useState } from "react";
import { FriendRequestCard } from "./friend-request-card";
import { Pagination } from "./pagination";
import { FriendRequest } from "@/types/friends";

const ITEMS_PER_PAGE = 10;
interface FriendRequestsProps {
    friendRequests: FriendRequest[];
}

export function FriendRequests({ friendRequests }: FriendRequestsProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(friendRequests.length / ITEMS_PER_PAGE);

    const paginatedRequests = friendRequests.slice(
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
            {!friendRequests.length && (
                <div className="grid place-items-center h-[60vh]">
                    <h1 className="text-lg smd:text-2xl font-bold font-plusJakarta">
                        No friend requests yet! Soon you will see them here.
                    </h1>
                </div>
            )}
        </div>
    );
}
