"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Users, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import useUser from "@/hooks/use-user";
import { Button } from "../ui/button";
import useShowAtRoutes from "@/hooks/use-showAtRoutes";

const navVariants = {
    initial: { opacity: 0, x: -20 },
    animate: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.3,
        },
    }),
    hover: {
        scale: 1.1,
        transition: {
            duration: 0.2,
        },
    },
};

export function MainSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const user = useUser();
    if (!useShowAtRoutes()) return null;

    const isActive = (path: string) => pathname === path;
    const handleLogout = () => {
        router.push("/logout");
    };

    const navItems = [
        { href: "/", icon: MessageSquare, label: "Chat" },
        { href: "/friends", icon: Users, label: "Friends" },
        { href: "/profile", icon: User, label: "Profile" },
    ];

    return (
        <motion.div
            initial={{ x: -72, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="smd:flex hidden w-[72px] h-screen bg-card/50 border-r border-border  flex-col items-center py-4 fixed left-0 top-0 backdrop-blur-xl"
        >
            <div className="flex-1 flex flex-col items-center gap-2">
                {navItems.map((item, i) => (
                    <motion.div
                        key={item.href}
                        className="w-full"
                        custom={i}
                        variants={navVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                    >
                        <Link
                            href={
                                item.href === "/profile"
                                    ? `/profile/${user?.userId}`
                                    : item.href
                            }
                            className={cn(
                                "w-full flex justify-center py-3 transition-colors",
                                isActive(item.href)
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            <item.icon className="w-6 h-6" />
                        </Link>
                    </motion.div>
                ))}
            </div>

            <Button variant={"ghost"} size={"icon"} onClick={handleLogout}>
                <LogOut className="w-6 h-6" />
            </Button>
        </motion.div>
    );
}
