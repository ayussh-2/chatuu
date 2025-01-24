"use client";

import React, { useState } from "react";

import { Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-Api";
import useUser from "@/hooks/use-user";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const { makeRequest, isLoading } = useApi();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        const userDetails = {
            password,
        };
        e.preventDefault();
        const resp = await makeRequest(
            "POST",
            "/auth/reset",
            userDetails,
            "Some error occoured while resetting password",
            true,
            true
        );

        if (resp?.status === "success") {
            router.push("/chats");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Reset Password
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {/* <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-10"
                                    value={userDetails.email}
                                    onChange={(e) =>
                                        setUserDetails((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </div>
                        </div> */}
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your new password"
                                    className="pl-10"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            type="submit"
                            isLoading={isLoading}
                        >
                            Reset Password
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
