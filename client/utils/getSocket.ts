import { io } from "socket.io-client";

class SocketService {
    private static instance: SocketService;
    private socket: any;

    private constructor() {
        this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
            transports: ["websocket"],
            autoConnect: true,
            reconnection: true,
        });

        this.socket.on("connect", () => {
            console.log("Socket connected:", this.socket.id);
        });

        this.socket.on("connect_error", (error: string) => {
            console.log("Socket connection error:", error);
        });

        this.socket.on("disconnect", (reason: string) => {
            console.log("Socket disconnected:", reason);
        });
    }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public getSocket() {
        return this.socket;
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

export const getSocket = () => SocketService.getInstance().getSocket();
