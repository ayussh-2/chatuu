"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Camera, User, Mail, Calendar } from "lucide-react";
import { EditableField } from "./editable-field";
import useUser from "@/hooks/use-user";
import { Button } from "../ui/button";
import { useApi } from "@/hooks/use-Api";

interface User {
    name: string;
    username: string;
    email: string;
    createdAt: string;
    id: number;
}

export function ProfileHeader({ user }: { user: User }) {
    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
    const loggedInUser = useUser();
    const { makeRequest, isLoading } = useApi();

    async function updateUserProfile() {
        if (!name || !username || !email) {
            return;
        }

        const response = await makeRequest(
            "PATCH",
            "/user/profile",
            {
                userId: user.id,
                name,
                username,
                email,
            },
            "Cannot update user profile",
            true,
            true
        );

        console.log(response);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-xl overflow-hidden shadow-lg"
        >
            <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            <div className="px-2 smd:px-8 pb-8 -mt-20">
                <div className="relative inline-block">
                    <Avatar className="w-32 h-32 border-4 border-card">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl text-white font-semibold">
                            {name[0]}
                        </div>
                    </Avatar>
                    <button className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>

                <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                        <EditableField
                            label="Name"
                            value={name}
                            onSave={setName}
                            className="text-2xl font-bold"
                            isAllowedEditing={loggedInUser?.userId === user.id}
                        />
                        <div className="flex smd:flex-row flex-col items-start smd:items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <EditableField
                                    label="Username"
                                    value={username}
                                    onSave={setUsername}
                                    isAllowedEditing={
                                        loggedInUser?.userId === user.id
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                <EditableField
                                    label="Email"
                                    value={email}
                                    onSave={setEmail}
                                    isAllowedEditing={
                                        loggedInUser?.userId === user.id
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {joinDate}</span>
                            </div>
                        </div>
                    </div>
                    {loggedInUser?.userId === user.id && (
                        <Button
                            variant={"outline"}
                            disabled={isLoading}
                            isLoading={isLoading}
                            onClick={updateUserProfile}
                        >
                            Save Details
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
