"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockUsers } from "@/config/friends";
import { SearchResult } from "@/types/friends";
import { Pagination } from "./pagination";
import { UserSearchCard } from "./user-search-card";

const ITEMS_PER_PAGE = 10;

export function AddFriends() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const results = mockUsers.filter(
            (user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
    const paginatedResults = searchResults.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by username or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>

            <div className="space-y-4">
                {paginatedResults.map((user) => (
                    <UserSearchCard key={user.id} user={user} />
                ))}
            </div>

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
