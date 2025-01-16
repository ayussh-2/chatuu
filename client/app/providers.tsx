"use client";
import { MainSidebar } from "@/components/layout/main-sidebar";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
            <MainSidebar />
            <main className="flex-1 ml-[72px]">{children}</main>
        </NextThemesProvider>
    );
}
