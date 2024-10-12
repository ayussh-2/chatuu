"use client";
import { ShootingStars } from "@/components/ui/shooting-stars";
import SidebarFinal from "@/components/ui/sidebar/sidebar";
import { StarsBackground } from "@/components/ui/stars-background";
import React from "react";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen w-full">
            <ShootingStars />
            <StarsBackground />
            <SidebarFinal />
            {children}
        </div>
    );
}
