import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
});

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
    console.log("Socket connection error:", error);
});

socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
});

export const getSocket = () => socket;
