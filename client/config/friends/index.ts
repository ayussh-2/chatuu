import { FriendRequest, User } from "@/types/friends";

export const mockUsers: User[] = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    username: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    profilePicture: `https://source.unsplash.com/random/150x150?portrait&${i}`,
    createdAt: new Date(),
}));

export const mockFriends: User[] = mockUsers.slice(0, 10);

export const mockFriendRequests: FriendRequest[] = Array.from(
    { length: 5 },
    (_, i) => ({
        id: i + 1,
        senderId: i + 11,
        receiverId: 1,
        status: "PENDING",
        sentAt: new Date(Date.now() - Math.random() * 1000000000),
        updatedAt: new Date(),
        sender: mockUsers[i + 10],
    })
).sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
