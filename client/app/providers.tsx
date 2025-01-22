"use client";
import { MainSidebar } from "@/components/layout/main-sidebar";
import MobileNavigation from "@/components/layout/mobile-bottom-bar";
import useShowAtRoutes from "@/hooks/use-showAtRoutes";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    const showSidebar = useShowAtRoutes();
    return (
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
            {showSidebar && (
                <>
                    <MainSidebar />
                    <MobileNavigation />
                </>
            )}
            <main className={`flex-1 ${showSidebar && "smd:ml-[72px]"}`}>
                {children}
            </main>
        </NextThemesProvider>
    );
}
