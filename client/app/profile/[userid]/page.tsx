"use client";

import Loader from "@/components/loader/Loader";
import { ProfileDetails } from "@/components/profile/profile-details";
import { ProfileHeader } from "@/components/profile/profile-header";
import { useApi } from "@/hooks/use-Api";
import useUser from "@/hooks/use-user";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ProfilePage({
    params,
}: {
    params: { userid: string };
}) {
    const { isLoading, makeRequest } = useApi();
    const [user, setUser] = useState(null);
    const loggedInUser = useUser();

    async function getUserProfile() {
        if (!params.userid) return;
        const response = await makeRequest(
            "POST",
            "/user/profile",
            { userId: parseInt(params.userid) },
            "Cannot fetch user profile",
            true,
            false
        );

        if (response?.status === "success") {
            setUser(response.data);
        }
    }

    useEffect(() => {
        getUserProfile();
    }, []);

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto space-y-6"
            >
                {isLoading && <Loader isLoading={isLoading} />}
                {!isLoading && user ? (
                    <>
                        <ProfileHeader user={user} />
                        <ProfileDetails
                            isLoggedInUser={
                                loggedInUser?.userId === parseInt(params.userid)
                            }
                        />
                    </>
                ) : (
                    <h2>Profile not found</h2>
                )}
            </motion.div>
        </div>
    );
}
