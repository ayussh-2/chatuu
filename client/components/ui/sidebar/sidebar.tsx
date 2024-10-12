"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import Image from "next/image";
import { links } from "@/config/home/sidebar";
export default function SidebarFinal() {
    const [open, setOpen] = useState(false);
    return (
        <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10 h-screen w-full">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    {open ? (
                        <h1 className="font-syne text-3xl">Chatuu.</h1>
                    ) : (
                        <h1 className="font-syne text-3xl">Ch</h1>
                    )}
                    <div className="mt-8 flex flex-col gap-2">
                        {links.map((link, idx) => (
                            <SidebarLink
                                key={idx}
                                link={{
                                    label: link.label,
                                    href: link.href,
                                    icon: (
                                        <Image
                                            src={link.icon}
                                            className="size-5 flex-shrink-0 dark:invert"
                                            width={50}
                                            height={50}
                                            alt="Avatar"
                                        />
                                    ),
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <SidebarLink
                        link={{
                            label: "Manu Arora",
                            href: "#",
                            icon: (
                                <Image
                                    src="https://assets.aceternity.com/manu.png"
                                    className="h-7 w-7 flex-shrink-0 rounded-full"
                                    width={50}
                                    height={50}
                                    alt="Avatar"
                                />
                            ),
                        }}
                    />
                </div>
            </SidebarBody>
        </Sidebar>
    );
}
