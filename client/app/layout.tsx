import type { Metadata } from "next";
import "./globals.css";
import "./styles/ui-styles.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Syne, Inter } from "next/font/google";

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
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
