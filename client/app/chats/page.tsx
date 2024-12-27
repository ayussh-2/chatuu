import { Sidebar } from "@/components/chat/sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import Loader from "@/components/loader/Loader";

export default function Home() {
    return (
        <main className="h-screen flex bg-background">
            <Loader isLoading={true} />
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <ChatHeader />
                <MessageList />
                <MessageInput />
            </div>
        </main>
    );
}
