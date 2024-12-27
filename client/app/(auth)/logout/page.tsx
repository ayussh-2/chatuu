"use client";
import React from "react";
import { useLayoutEffect } from "react";
import { handleLogout } from "@/utils/actions/authHandler";
export default function Page() {
    useLayoutEffect(() => {
        logOutUser();
    });

    function logOutUser() {
        handleLogout();
        localStorage.removeItem("loggedInChatuuUser");
    }

    return (
        <div>
            <h1>Logging out...</h1>
        </div>
    );
}
