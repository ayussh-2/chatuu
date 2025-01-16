export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    profilePicture?: string;
    createdAt: Date;
    userId?: number;
}

export interface FriendRequest {
    id: number;
    senderId: number;
    receiverId: number;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELED";
    sentAt: Date;
    updatedAt: Date;
    sender: User;
}

export interface SearchResult {
    id: number;
    name: string;
    username: string;
    profilePicture?: string;
    email: string;
    createdAt: Date;
    requestId?: number;
    requestStatus?: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELED";
}
