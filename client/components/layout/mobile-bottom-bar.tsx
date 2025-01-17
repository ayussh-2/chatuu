import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Users, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import useUser from "@/hooks/use-user";
import { Button } from "../ui/button";

const navVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({
        opacity: 1,
        y: 0,
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

const MobileNavigation = () => {
    const pathname = usePathname();
    const router = useRouter();
    const user = useUser();

    if (pathname === "/" || pathname === "/reset" || pathname === "/logout")
        return null;

    const isActive = (path: string) => pathname === path;

    const handleLogout = () => {
        router.push("/logout");
    };

    const navItems = [
        { href: "/", icon: MessageSquare, label: "Chat" },
        { href: "/friends", icon: Users, label: "Friends" },
        { href: "/profile", icon: User, label: "Profile" },
        {
            href: "/logout",
            icon: LogOut,
            label: "Logout",
            onClick: handleLogout,
        },
    ];

    return (
        <motion.div
            initial={{ y: 72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed smd:hidden bottom-0 left-0 right-0 h-16 bg-card/50 border-t border-border backdrop-blur-xl"
        >
            <div className="h-full mx-auto px-1 sm:px-4 flex items-center justify-between">
                {navItems.map((item, i) => (
                    <div key={item.href} className="flex-1">
                        {item.onClick ? (
                            <button
                                onClick={item.onClick}
                                className={cn(
                                    "w-full flex flex-col items-center gap-1 py-1 transition-all",
                                    isActive(item.href)
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-primary"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-xs font-medium">
                                    {item.label}
                                </span>
                            </button>
                        ) : (
                            <>
                                <Link
                                    href={
                                        item.href === "/profile"
                                            ? `/profile/${user?.userId}`
                                            : item.href
                                    }
                                    className={cn(
                                        "w-full flex flex-col items-center gap-1 py-1 transition-all",
                                        isActive(item.href)
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-primary"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-xs font-medium">
                                        {item.label}
                                    </span>
                                </Link>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default MobileNavigation;
