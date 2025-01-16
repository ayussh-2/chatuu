export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    profilePicture?: string;
    createdAt: Date;
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
}
