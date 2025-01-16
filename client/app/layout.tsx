import type { Metadata } from "next";
import "./globals.css";
import "./styles/ui-styles.css";
import { Toaster } from "react-hot-toast";
import { inter, plusJakarta, syne } from "./fonts";
import { Providers } from "./providers";
import { Sidebar } from "@/components/chat/sidebar";
export const metadata: Metadata = {
    title: "Chatuu",
    description: "An online chat application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${syne.variable} ${plusJakarta.variable} antialiased`}
            >
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{
                        style: {
                            background: "rgba(4, 10, 22, 0.5)",
                            color: "#ffffff",
                            padding: "16px",
                            borderRadius: "20px",
                            boxShadow: "0 4px 15px rgba(0, 5, 15, 0.8)",
                            backdropFilter: "blur(50px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            fontFamily: "var(--font-inter)",
                        },
                    }}
                />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
