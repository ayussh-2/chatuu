"use client";
import { MainSidebar } from "@/components/layout/main-sidebar";
import MobileNavigation from "@/components/layout/mobile-bottom-bar";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
            <MainSidebar />
            <MobileNavigation />
            <main className="flex-1 smd:ml-[72px]">{children}</main>
        </NextThemesProvider>
    );
}
