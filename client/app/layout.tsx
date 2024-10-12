import type { Metadata } from "next";
import "./globals.css";
import "./styles/ui-styles.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Syne, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const syne = Syne({
    subsets: ["latin-ext"],
    weight: ["500", "400", "800", "600", "700"],
    variable: "--font-syne",
});

const inter = Inter({
    subsets: ["latin-ext"],
    weight: ["500", "400", "800", "600", "700"],
    variable: "--font-inter",
});

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
            <body className={`${inter.variable} ${syne.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
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
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
